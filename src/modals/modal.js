import React, { Component }  from 'react';

import './modal.css';
import modal_img from "../assets/img/modal.jpg";
import close from "../assets/img/icon-close.png";

const Modal = ({ handleClose, show, children, handleForm }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <img src={modal_img} alt="Girl in a jacket" width="500" height="500"></img>
                {/* <button style={{ backgroundSize: "cover", width: "40px", height: "40px" }} type="button" onClick={handleClose}>
                    Close
                </button> */}
                <div className="content" id="close_button">
                    <img
                        style={{ width: "30px" }}
                        src={close}
                        alt="close icon"
                        onClick={handleClose}
                    />
                </div>
                <div className="click" id="close_button">
                    <img
                        style={{ width: "81px", height:"39px" }}
                        src={close}
                        alt="close icon"
                        onClick={handleForm}
                    />
                </div>
            </section>
        </div>
    );
};

export default Modal
