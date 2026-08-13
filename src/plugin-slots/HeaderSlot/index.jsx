import PropTypes from 'prop-types';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

const HeaderSlot = ({
  courseOrg,
  courseNumber,
  courseTitle,
  showUserDropdown,
}) => {
  const courseCode = [courseOrg, courseNumber].filter(Boolean).join(' ');

  return (
    <PluginSlot
      id="org.openedx.frontend.layout.header_learning.v1"
      idAliases={['header_slot']}
      slotOptions={{
        mergeProps: true,
      }}
      pluginProps={{
        courseOrg,
        courseNumber,
        courseTitle,
        showUserDropdown,
      }}
    >
      {(courseCode || courseTitle) && (
        <div className="rowad-learning-course-context">
          <div className="rowad-learning-course-context__inner">
            {courseCode && (
              <span className="rowad-learning-course-context__code">
                {courseCode}
              </span>
            )}

            {courseTitle && (
              <span className="rowad-learning-course-context__title">
                {courseTitle}
              </span>
            )}
          </div>
        </div>
      )}
    </PluginSlot>
  );
};

HeaderSlot.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  showUserDropdown: PropTypes.bool,
};

HeaderSlot.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default HeaderSlot;
