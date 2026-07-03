import React, { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton } from '@openedx/paragon';
import { Minus, Plus } from '@openedx/paragon/icons';

import { useModel } from '../../../generic/model-store';
import genericMessages from '../../../generic/messages';
import { useContextId } from '../../../data/hooks';
import messages from '../messages';
import SectionTitle from '../section-outline/SectionTitle';
import HiddenSequenceLink from '../section-outline/HiddenSequenceLink';
import UnitGrid from './UnitGrid';

interface Sequence {
  id: string;
  complete: boolean;
  title: string;
  hideFromTOC: boolean;
  unitIds?: string[];
}

interface Props {
  expandAll: boolean;
  sectionIds: string[];
  sections: Record<string, { sequenceIds: string[] }>;
}

const NonLinearSubsection: React.FC<{ sequence: Sequence; expand: boolean }> = ({ sequence, expand }) => {
  const intl = useIntl();
  const courseId = useContextId();
  const { courseBlocks: { units = {} } = {} } = useModel('outline', courseId);
  const [open, setOpen] = useState(expand);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  const {
    complete, title, hideFromTOC, unitIds,
  } = sequence;

  return (
    <li>
      <Collapsible
        className="mb-2"
        styling="card-lg"
        title={<SectionTitle {...{ complete, hideFromTOC, title }} />}
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
        {hideFromTOC && (<HiddenSequenceLink />)}
        <UnitGrid sequenceId={sequence.id} unitIds={unitIds || []} units={units} />
      </Collapsible>
    </li>
  );
};

const NonLinearOutline: React.FC<Props> = ({ expandAll, sectionIds, sections }) => {
  const courseId = useContextId();
  const { courseBlocks: { sequences = {} } = {} } = useModel('outline', courseId);

  const sequenceIds = sectionIds.flatMap((sectionId) => sections[sectionId]?.sequenceIds || []);

  return (
    <ol id="courseHome-outline" className="list-unstyled">
      {sequenceIds.map((sequenceId) => {
        const sequence = sequences?.[sequenceId];
        if (!sequence) {
          return null;
        }
        return (
          <NonLinearSubsection key={sequenceId} sequence={sequence} expand={expandAll} />
        );
      })}
    </ol>
  );
};

export default NonLinearOutline;
