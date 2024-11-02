import { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import { HiDotsVertical } from 'react-icons/hi';
import { IoMdAddCircle } from 'react-icons/io';

import Applogo from '../../assests/note.png';

import './Header.css';
import Button from '../button/Button';
import Menu from '../menu/Menu';
import { CREATENOTE, HOME, NOTES, TAGS } from '../../constants/routeConstants';

const Header = () => {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);

  function handleCreateBtn() {
    navigate(CREATENOTE);
  }
  function handlepopup() {
    setPopup((prev) => !prev);
  }

  return (
    <div className="header_container">
      <a className="skip_link" href="#main-navigation">
        Skip to main navigation
      </a>
      <img src={Applogo} alt="app logo" />
      <ul className="nav_container">
        <li>
          <NavLink to={HOME}>Home</NavLink>
        </li>
        <li>
          <NavLink to={NOTES}>Notes</NavLink>
        </li>
        <li>
          <NavLink to={TAGS}>Tags</NavLink>
        </li>
      </ul>
      <div>
        <Button
          shape="ellipse"
          onClick={handleCreateBtn}
          endIcon={<IoMdAddCircle />}
          type="submit"
        >
          Create Note
        </Button>
        <HiDotsVertical
          role="button"
          tabIndex={0}
          aria-label="side menu"
          cursor={'pointer'}
          data-testid="dots-icon"
          id="dots-icon"
          fontSize={40}
          onClick={handlepopup}
          aria-controls={popup ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={popup ? 'true' : undefined}
        />
      </div>
      {popup && <Menu />}
    </div>
  );
};
export default Header;
