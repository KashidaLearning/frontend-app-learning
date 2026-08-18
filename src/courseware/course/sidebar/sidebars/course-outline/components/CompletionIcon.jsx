import PropTypes from 'prop-types';

const CompletionIcon = ({
  completionStat: { completed = 0, total = 0 },
  enabled,
}) => {
  const percentage = enabled && total > 0
    ? Math.min((completed / total) * 100, 100)
    : 0;

  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - (percentage / 100));

  let state = 'incomplete';
  let testId = 'completion-solid-icon';

  if (percentage >= 100) {
    state = 'complete';
    testId = 'check-circle-icon';
  } else if (percentage > 0) {
    state = 'partial';
    testId = 'dashed-circle-icon';
  }

  return (
    <svg
      aria-hidden="true"
      className={`rowad-outline-completion-icon is-${state}`}
      data-testid={testId}
      viewBox="0 0 20 20"
    >
      {state === 'complete' ? (
        <circle
          className="rowad-outline-completion-complete"
          cx="10"
          cy="10"
          r="8"
        />
      ) : (
        <>
          <circle
            className="rowad-outline-completion-track"
            cx="10"
            cy="10"
            r={radius}
          />

          <circle
            className="rowad-outline-completion-progress"
            cx="10"
            cy="10"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={
              state === 'incomplete'
                ? 0
                : progressOffset
            }
            transform="rotate(-90 10 10)"
          />
        </>
      )}
    </svg>
  );
};

CompletionIcon.propTypes = {
  completionStat: PropTypes.shape({
    completed: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
  enabled: PropTypes.bool.isRequired,
};

export default CompletionIcon;
