import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton } from '@openedx/paragon';
import { Minus, Plus } from '@openedx/paragon/icons';

import genericMessages from '../../../generic/messages';
import { useContextId } from '../../../data/hooks';
import messages from '../messages';

interface Unit {
  id: string;
  title: string;
}

interface Props {
  sequenceId: string;
  unitIds: string[];
  units: Record<string, Unit>;
}

const SubsectionUnitsList: React.FC<Props> = ({ sequenceId, unitIds, units }) => {
  const intl = useIntl();
  const courseId = useContextId();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isPreview = pathname.startsWith('/preview');

  return (
    <Collapsible
      className="mt-2 subsection-units-list"
      styling="basic"
      title={intl.formatMessage(messages.unitsListTitle)}
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
      <ul className="list-unstyled mb-0">
        {unitIds.map((unitId) => {
          const unit = units[unitId];
          if (!unit) {
            return null;
          }
          const baseUrl = `/course/${courseId}/${sequenceId}/${unitId}`;
          const unitUrl = isPreview ? `/preview${baseUrl}` : baseUrl;
          return (
            <li key={unitId} className="py-1">
              <Link to={unitUrl}>{unit.title}</Link>
            </li>
          );
        })}
      </ul>
    </Collapsible>
  );
};

export default SubsectionUnitsList;
