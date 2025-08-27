import { useRef, useEffect } from "react";
import { icons } from "../../../assets/icons/icons";
import { waapi, stagger } from 'animejs';
import { Link } from "react-router-dom";
import "./HeaderAdmin.css"
import { useSelector } from "react-redux";

const HeaderAdmin = () => {
   const bdlvGamingRef = useRef(null);
   const user = useSelector(state => state.auth.user);
    useEffect(() => {
      waapi.animate('.bdlv-gaming p', {
        translate: `0 -15px`,
        delay: stagger(150),
        duration: 1000,
        loop: true,
        alternate: true,
        ease: 'inOut(3)',
      });
      
    },[])
  return (
    <div className="main-header" style={{marginBottom: "20px"}}>
      <div className="logo">
        <Link to="/admin/list-game">
          <span
            ref={bdlvGamingRef}
            className="bdlv-gaming large grid centered square-grid text-xl"
          >
            <p>A</p>
            <p>D</p>
            <p>M</p>
            <p>I</p>
            <p>N</p>
          </span>
          <img src={icons.logo} alt="logo" style={{left: "-100%"}}/>
        </Link>
      </div>
      <div className="logo-email">
        <p>{user?.email}</p>
        <img src={icons.admin} alt="" />
      </div>
    </div>
  );
};

export default HeaderAdmin;
