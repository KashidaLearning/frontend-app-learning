import React from 'react';
import classNames from 'classnames';

import { useModel } from '../../../generic/model-store';
import { useContextId } from '../../../data/hooks';
import SequenceDueDate from './SequenceDueDate';
import HiddenSequenceLink from './HiddenSequenceLink';
import SequenceTitle from './SequenceTitle';
import SubsectionUnitsList from './SubsectionUnitsList';

interface Props {
  id: string;
  first: boolean;
  sequence: {
    complete: boolean;
    description: string;
    due: string;
    showLink: boolean;
    title: string;
    hideFromTOC: boolean;
    unitIds?: string[];
  }
}

const SequenceLink: React.FC<Props> = ({
  id,
  first,
  sequence,
}) => {
  const {
    complete,
    description,
    due,
    showLink,
    title,
    hideFromTOC,
    unitIds,
  } = sequence;

  const courseId = useContextId();
  const { courseType, courseBlocks: { units = {} } = {} } = useModel('outline', courseId);
  const showUnitsList = courseType === 'linear' && Array.isArray(unitIds) && unitIds.length > 0;

  return (
    <li>
      <div className={classNames('', { 'mt-2 pt-2 border-top border-light': !first })}>
        <SequenceTitle
          {...{
            complete,
            showLink,
            title,
            sequence,
            id,
          }}
        />
        {hideFromTOC && (
          <HiddenSequenceLink />
        )}
        <SequenceDueDate {...{ due, id, description }} />
        {showUnitsList && (
          <SubsectionUnitsList sequenceId={id} unitIds={unitIds as string[]} units={units} />
        )}
      </div>
    </li>
  );
};

export default SequenceLink;
