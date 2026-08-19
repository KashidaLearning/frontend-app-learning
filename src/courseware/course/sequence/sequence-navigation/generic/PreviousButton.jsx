import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, IconButton, Icon } from '@openedx/paragon';
import { ReactComponent as PreviousArrow } from './../../../../../custom-icons/PreviousArrow.svg';
import { ReactComponent as NextArrow } from './../../../../../custom-icons/NextArrow.svg';
import { isRtl, getLocale } from '@edx/frontend-platform/i18n';

const PreviousButton = ({
  onClick,
  buttonLabel,
  previousLink,
  variant,
  buttonStyle,
  isFirstUnit,
  isAtTop,
}) => {
  const navigate = useNavigate();
  const disabled = isFirstUnit;
  const { pathname } = useLocation();
  const navLink = pathname.startsWith('/preview') ? `/preview${previousLink}` : previousLink;

  const getPrevArrow = () => (
  isRtl(getLocale()) ? NextArrow : PreviousArrow
);

  const prevArrow = getPrevArrow();

  const onClickHandler = () => {
    navigate(navLink);
    onClick();
  };

  if (isAtTop) {
    return (
      <IconButton
        className={`${buttonStyle} icon-hover`}
        onClick={onClickHandler}
        src={prevArrow}
        disabled={disabled}
        iconAs={Icon}
        alt={buttonLabel}
      />
    );
  }

  return (
    <Button
      variant={variant}
      className={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      as={disabled ? undefined : Link}
      to={disabled ? undefined : navLink}
      iconBefore={prevArrow}
    >
  
    </Button>
  );
};

PreviousButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  previousLink: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string.isRequired,
  isFirstUnit: PropTypes.bool.isRequired,
  isAtTop: PropTypes.bool.isRequired,
};

export default PreviousButton;
