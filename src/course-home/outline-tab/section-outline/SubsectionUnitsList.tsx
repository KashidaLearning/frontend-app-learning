import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useContextId } from '../../../data/hooks';

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
  const courseId = useContextId();
  const { pathname } = useLocation();

  const isPreview = pathname.startsWith('/preview');

  return (
    <ul className="list-unstyled mb-0 mt-2 subsection-units-list">
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
  );
};

export default SubsectionUnitsList;
