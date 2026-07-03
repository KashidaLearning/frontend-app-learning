import React from 'react';

import UnitCard from './UnitCard';
import './NonLinearOutline.scss';

interface Unit {
  id: string;
  title: string;
  imageForUnit?: string;
  imageForUnitIcon?: string;
  durationForUnit?: string;
}

interface Props {
  sequenceId: string;
  unitIds: string[];
  units: Record<string, Unit>;
}

const UnitGrid: React.FC<Props> = ({ sequenceId, unitIds, units }) => (
  <div className="unit-grid">
    {unitIds.map((unitId) => {
      const unit = units?.[unitId];
      if (!unit) {
        return null;
      }
      return (
        <UnitCard
          key={unitId}
          id={unit.id}
          sequenceId={sequenceId}
          title={unit.title}
          imageForUnit={unit.imageForUnit}
          imageForUnitIcon={unit.imageForUnitIcon}
          durationForUnit={unit.durationForUnit}
        />
      );
    })}
  </div>
);

export default UnitGrid;
