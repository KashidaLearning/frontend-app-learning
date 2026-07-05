import React, { useState } from 'react';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton } from '@openedx/paragon';
import { Minus, Plus } from '@openedx/paragon/icons';

import { useModel } from '../../../generic/model-store';
import genericMessages from '../../../generic/messages';
import { useContextId } from '../../../data/hooks';
import messages from '../messages';
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

  const intl = useIntl();
  const courseId = useContextId();
  const { courseType, courseBlocks: { units = {} } = {} } = useModel('outline', courseId);
  const showUnitsList = courseType !== 'non-linear' && Array.isArray(unitIds) && unitIds.length > 0;
  const [open, setOpen] = useState(false);

  const header = (
    <>
      <SequenceTitle
        {...{
          complete,
          // Once a subsection has an expandable unit list, its name toggles that list
          // instead of navigating away, so units are reached via their own links.
          showLink: showUnitsList ? false : showLink,
          title,
          sequence,
          id,
        }}
      />
      {hideFromTOC && (
        <HiddenSequenceLink />
      )}
      <SequenceDueDate {...{ due, id, description }} />
    </>
  );

  return (
    <li>
      <div className={classNames('', { 'mt-2 pt-2 border-top border-light': !first })}>
        {showUnitsList ? (
          <Collapsible
            styling="basic"
            title={header}
            open={open}
            onToggle={() => { setOpen(!open); }}
            iconWhenClosed={(
              <IconButton
                alt={intl.formatMessage(messages.openSection)}
                iconAs={Plus}
                onClick={() => { setOpen(true); }}
                size="sm"
              />
            )}
            iconWhenOpen={(
              <IconButton
                alt={intl.formatMessage(genericMessages.close)}
                iconAs={Minus}
                onClick={() => { setOpen(false); }}
                size="sm"
              />
            )}
          >
            <SubsectionUnitsList sequenceId={id} unitIds={unitIds as string[]} units={units} />
          </Collapsible>
        ) : header}
      </div>
    </li>
  );
};

export default SequenceLink;
