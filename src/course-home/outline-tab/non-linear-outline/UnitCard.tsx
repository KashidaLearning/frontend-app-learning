import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';

import { useContextId } from '../../../data/hooks';

interface Props {
  id: string;
  sequenceId: string;
  title: string;
  imageForUnit?: string;
  imageForUnitIcon?: string;
  durationForUnit?: string;
}

const resolveAssetUrl = (path?: string): string | undefined => {
  if (!path) {
    return undefined;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${getConfig().LMS_BASE_URL}${path}`;
};

const UnitCard: React.FC<Props> = ({
  id, sequenceId, title, imageForUnit, imageForUnitIcon, durationForUnit,
}) => {
  const courseId = useContextId();
  const { pathname } = useLocation();
  const isPreview = pathname.startsWith('/preview');
  const baseUrl = `/course/${courseId}/${sequenceId}/${id}`;
  const unitUrl = isPreview ? `/preview${baseUrl}` : baseUrl;

  const imageUrl = resolveAssetUrl(imageForUnit);
  const iconUrl = resolveAssetUrl(imageForUnitIcon);

  return (
    <Link to={unitUrl} className="unit-card d-block text-decoration-none">
      <div className="unit-card__image-wrapper position-relative">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="unit-card__image w-100" />
        ) : (
          <div className="unit-card__image unit-card__image--placeholder w-100" />
        )}
        {iconUrl && (
          <span className="unit-card__icon-badge">
            <img src={iconUrl} alt="" />
          </span>
        )}
        {durationForUnit && (
          <span className="unit-card__duration-badge">{durationForUnit}</span>
        )}
      </div>
      <div className="unit-card__title text-truncate">{title}</div>
    </Link>
  );
};

export default UnitCard;
