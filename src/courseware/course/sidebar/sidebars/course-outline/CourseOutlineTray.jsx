import classNames from 'classnames';
import { IconButton } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { MenuOpen as MenuOpenIcon } from '@openedx/paragon/icons';

import { LOADING } from '@src/constants';
import PageLoading from '@src/generic/PageLoading';
import SidebarSection from './components/SidebarSection';
import { ID } from './constants';
import { useCourseOutlineSidebar } from './hooks';
import messages from './messages';

const CourseOutlineTray = () => {
  const intl = useIntl();

  const {
    courseId,
    courseName,
    unitId,
    currentSidebar,
    handleToggleCollapse,
    isActiveEntranceExam,
    shouldDisplayFullScreen,
    courseOutlineStatus,
    activeSequenceId,
    sections,
    sequences,
  } = useCourseOutlineSidebar();

  const sectionIds = Object.keys(sections);

  const sidebarHeading = (
    <div className="outline-sidebar-heading-wrapper sticky d-flex justify-content-between align-self-start align-items-center bg-light-200 p-2.5 pl-4">
      <span className="outline-sidebar-heading mb-0 h4 text-dark-500">
        {courseName || intl.formatMessage(messages.courseOutlineTitle)}
      </span>

      <IconButton
        alt={intl.formatMessage(messages.toggleCourseOutlineTrigger)}
        className="outline-sidebar-toggle-btn flex-shrink-0 text-dark bg-light-200"
        iconAs={MenuOpenIcon}
        onClick={handleToggleCollapse}
      />
    </div>
  );

  if (isActiveEntranceExam || currentSidebar !== ID) {
    return null;
  }

  if (courseOutlineStatus === LOADING) {
    return (
      <div className={classNames('outline-sidebar-wrapper', {
        'flex-shrink-0 mr-4 h-auto': !shouldDisplayFullScreen,
        'bg-white m-0 fixed-top w-100 vh-100': shouldDisplayFullScreen,
      })}
      >
        <section className="outline-sidebar w-100">
          {sidebarHeading}
          <PageLoading
            srMessage={intl.formatMessage(messages.loading)}
          />
        </section>
      </div>
    );
  }

  return (
    <div className={classNames('outline-sidebar-wrapper', {
      'flex-shrink-0 mr-4 h-auto': !shouldDisplayFullScreen,
      'bg-white m-0 fixed-top w-100 vh-100': shouldDisplayFullScreen,
    })}
    >
      <section className="outline-sidebar w-100">
        {sidebarHeading}

        <ol id="outline-sidebar-outline" className="list-unstyled">
          {sectionIds.map((sectionId) => {
            const section = sections[sectionId];
            const isActiveSection = section.sequenceIds.includes(activeSequenceId);

            return (
              <SidebarSection
                key={sectionId}
                courseId={courseId}
                section={section}
                sequences={sequences}
                activeUnitId={unitId}
                defaultOpen={isActiveSection}
              />
            );
          })}
        </ol>
      </section>
    </div>
  );
};

CourseOutlineTray.ID = ID;

export default CourseOutlineTray;
