import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { IconButton } from '@openedx/paragon';
import { TableRows } from '@openedx/paragon/icons';

import { useCourseOutlineSidebar } from './hooks';
import { ID } from './constants';
import messages from './messages';

const CourseOutlineTrigger = ({ isMobileView }) => {
  const intl = useIntl();

  const {
    currentSidebar,
    shouldDisplayFullScreen,
    handleToggleCollapse,
    isActiveEntranceExam,
    isEnabledSidebar,
  } = useCourseOutlineSidebar();

  const isCollapsed = currentSidebar !== ID;

  const shouldShowTrigger = isCollapsed || isMobileView;

  if (!shouldShowTrigger || !isEnabledSidebar || isActiveEntranceExam) {
    return null;
  }

  return (
    <div
      className={classNames('outline-sidebar-heading-wrapper collapsed align-self-start', {
        'flex-shrink-0 mr-4 p-2.5': !isMobileView && !shouldDisplayFullScreen,
        'p-0': isMobileView || shouldDisplayFullScreen,
      })}
    >
      <IconButton
        alt={intl.formatMessage(messages.toggleCourseOutlineTrigger)}
        className="outline-sidebar-toggle-btn flex-shrink-0 text-dark rounded-0"
        iconAs={TableRows}
        onClick={handleToggleCollapse}
      />
    </div>
  );
};

CourseOutlineTrigger.defaultProps = {
  isMobileView: false,
};

CourseOutlineTrigger.propTypes = {
  isMobileView: PropTypes.bool,
};

export default CourseOutlineTrigger;