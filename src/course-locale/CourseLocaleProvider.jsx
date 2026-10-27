import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { matchPath, useLocation } from 'react-router-dom';
import {
  IntlProvider, getLocale, getMessages, handleRtl, isRtl,
} from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { getCourseLanguage, sendCourseLanguageToLms } from './api';

/**
 * Renders the Learning MFE in the language configured for the course in Studio
 * (Advanced Settings > Course Language), instead of the learner's account language.
 *
 * The override is scoped to this page: a nested IntlProvider replaces the one from
 * AppProvider, and <html lang/dir> follow it. The shared language-preference cookie
 * is never touched, so the dashboard and the other MFEs keep the account language.
 *
 * The course language applies every time a course is opened. If the learner picks a
 * language from the header while inside a course, the header saves it as their account
 * language and reloads; that choice is shown for the rest of this visit only (until the
 * next full page load), so opening the course again uses the course language.
 */

const COURSE_PATHS = ['/course/:courseId/*', '/preview/course/:courseId/*'];
const COURSE_LANGUAGE_CACHE_KEY = 'rowad-course-language';
// sessionStorage, read once on the page load that follows the header's language switch.
const LEARNER_CHOICE_KEY = 'rowad-course-language-choice';

const CourseLocaleContext = createContext({});

export const useCourseLocale = () => useContext(CourseLocaleContext);

const getCourseIdFromPath = (pathname) => {
  for (let i = 0; i < COURSE_PATHS.length; i++) {
    const match = matchPath({ path: COURSE_PATHS[i] }, pathname);
    if (match) {
      return match.params.courseId;
    }
  }
  return null;
};

const readStorage = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (storage, key, value) => {
  try {
    storage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the override still applies for this page view.
  }
};

const readLearnerChoice = () => {
  try {
    return JSON.parse(readStorage(window.sessionStorage, LEARNER_CHOICE_KEY)) || null;
  } catch {
    return null;
  }
};

const CourseLocaleProvider = ({ children }) => {
  const { pathname } = useLocation();
  const courseId = getCourseIdFromPath(pathname);
  const cacheKey = `${COURSE_LANGUAGE_CACHE_KEY}:${courseId}`;

  // { courseId, language } picked from the header just before this page load, if any.
  const [learnerChoice] = useState(readLearnerChoice);
  useEffect(() => {
    try {
      window.sessionStorage.removeItem(LEARNER_CHOICE_KEY);
    } catch {
      // Nothing to clean up when storage is unavailable.
    }
  }, []);

  // `undefined` means "not resolved yet", `null` means "no course language to apply".
  const [courseLanguage, setCourseLanguage] = useState(
    () => (courseId ? readStorage(window.sessionStorage, cacheKey) || undefined : null),
  );

  useEffect(() => {
    if (!courseId) {
      setCourseLanguage(null);
      return undefined;
    }

    let isMounted = true;
    setCourseLanguage(readStorage(window.sessionStorage, cacheKey) || undefined);
    getCourseLanguage(courseId)
      .then((language) => {
        if (isMounted) {
          writeStorage(window.sessionStorage, cacheKey, language);
          setCourseLanguage(language);
        }
      })
      .catch((error) => {
        logError(error);
        if (isMounted) {
          setCourseLanguage(current => current || null);
        }
      });
    return () => { isMounted = false; };
  }, [courseId, cacheKey]);

  const accountLocale = getLocale();
  const choiceForCourse = learnerChoice && learnerChoice.courseId === courseId ? learnerChoice.language : null;
  const requestedLanguage = courseId && (choiceForCourse || courseLanguage);
  const courseLocale = requestedLanguage ? getLocale(requestedLanguage) : null;
  const languageOverride = courseLocale && courseLocale !== accountLocale ? courseLocale : undefined;

  // On course pages, always tell the LMS which language the page shows: without the header
  // it answers course requests in the course language, which is wrong after a learner's switch.
  // Set during render (not in an effect) so it is in place before the children's
  // effects make their first API calls; effects run child-first.
  sendCourseLanguageToLms(courseId ? languageOverride || accountLocale : undefined);

  useEffect(() => {
    if (!languageOverride) {
      return undefined;
    }
    const html = document.documentElement;
    html.setAttribute('lang', languageOverride);
    html.setAttribute('dir', isRtl(languageOverride) ? 'rtl' : 'ltr');
    return () => {
      html.setAttribute('lang', getLocale());
      handleRtl();
    };
  }, [languageOverride]);

  const contextValue = useMemo(() => ({
    languageOverride,
    onLanguageChange: courseId
      ? (language) => writeStorage(window.sessionStorage, LEARNER_CHOICE_KEY, JSON.stringify({ courseId, language }))
      : undefined,
  }), [languageOverride, courseId]);

  // Hold the first paint of a course page until its language is known, so the page
  // doesn't render in the account language and then flip direction.
  if (courseLanguage === undefined) {
    return null;
  }

  const locale = languageOverride || accountLocale;
  return (
    <IntlProvider locale={locale} messages={getMessages(locale)}>
      <CourseLocaleContext.Provider value={contextValue}>
        {children}
      </CourseLocaleContext.Provider>
    </IntlProvider>
  );
};

CourseLocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CourseLocaleProvider;
