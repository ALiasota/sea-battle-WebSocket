import React from "react";


const ActionsInfo = ({ shipsReady = false, canShoot = false, ready }) => {
    if (!shipsReady) {
        return <button 
                    className="btn-ready"
                    onClick={ready}
                >
                    Ships are ready
                </button>
    }
    
    return (
        <>
            {canShoot ? <p>Can Shoot</p> : <p>Can't Shoot</p>}
        </>
    );
};

export default ActionsInfo;