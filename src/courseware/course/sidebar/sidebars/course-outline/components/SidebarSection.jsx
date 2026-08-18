import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible } from '@openedx/paragon';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import CompletionIcon from './CompletionIcon';
import SidebarSequence from './SidebarSequence';
import { useCourseOutlineSidebar } from '../hooks';

const SidebarSection = ({
  courseId,
  section,
  sequences,
  activeUnitId,
  defaultOpen,
}) => {
  const intl = useIntl();
  const [open, setOpen] = useState(defaultOpen);

  const {
    complete,
    title,
    sequenceIds,
    completionStat,
  } = section;

  const {
    activeSequenceId,
    isEnabledCompletionTracking,
  } = useCourseOutlineSidebar();

  const sectionTitle = (
    <>
      <div className="col-auto p-0 rowad-section-progress">
        <CompletionIcon
          completionStat={completionStat}
          enabled={isEnabledCompletionTracking}
        />
      </div>

      <div className="col-9 d-flex flex-column flex-grow-1 ml-3 mr-auto p-0 text-left">
        <span className="align-middle text-dark-500 rowad-section-title">
          {title}
        </span>

        {isEnabledCompletionTracking && (
          <span className="sr-only">
            , {intl.formatMessage(
            complete
              ? courseOutlineMessages.completedSection
              : courseOutlineMessages.incompleteSection,
          )}
          </span>
        )}
      </div>
    </>
  );

  return (
    <li className="mb-2 course-sidebar-section rowad-sidebar-section">
      <Collapsible
        className={classNames('rowad-section-collapsible', {
          'active-section': defaultOpen,
        })}
        styling="card-lg text-break"
        title={sectionTitle}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        <ol className="list-unstyled rowad-section-sequences">
          {sequenceIds.map((sequenceId) => {
            const sequence = sequences[sequenceId];

            if (!sequence) {
              return null;
            }

            return (
              <SidebarSequence
                key={sequenceId}
                courseId={courseId}
                sequence={sequence}
                defaultOpen={sequenceId === activeSequenceId}
                activeUnitId={activeUnitId}
              />
            );
          })}
        </ol>
      </Collapsible>
    </li>
  );
};

SidebarSection.propTypes = {
  courseId: PropTypes.string.isRequired,
  activeUnitId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  section: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    sequenceIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  sequences: PropTypes.objectOf(PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    specialExamInfo: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  })).isRequired,
};

export default SidebarSection;
