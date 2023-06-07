import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [invitationGame, setInvitationGame] = useState(false);
    const [gameId, setGameId] = useState('');
    const [nickName, setNickName] = useState('');

    const navigate = useNavigate();

    const startPlay = (e) => {
        e.preventDefault();
        if (nickName && gameId) {
            localStorage.nickName = nickName;
            navigate('/game/' + gameId)
        }
    }

    return(
        <>
            <h2>Auth</h2>
            <form onSubmit={startPlay}>
                <div className="field-group">
                    <div>
                        <label htmlFor="nickname">Name</label>
                    </div>
                    <input
                        type="text"
                        name="nickname"
                        id="nickname"
                        onChange={e => setNickName(e.target.value)}
                    />
                </div>
                <div 
                onChange={e => setInvitationGame(e.target.id === 'ingame')}
                className="field-group"
                >
                    <input 
                        type="radio"
                        name="typeEnter"
                        id="gen"
                        value={!invitationGame}
                        // defaultValue={!invitationGame}
                    />
                    <label htmlFor="gen">Create game</label>
                    <input
                        type="radio"
                        name="typeEnter"
                        id="ingame"
                        value={invitationGame}
                        // defaultValue={invitationGame}
                    />
                    <label htmlFor="ingame">Enter the game by Id</label>
                </div>
                <div className="field-group">
                    {invitationGame ? (
                        <>
                            <div>
                                <label htmlFor="gameId">Enter Game Id</label>
                            </div>
                            <input
                                type="text"
                                name="gameId"
                                id="gameId"
                                defaultValue=""
                                onChange={e => setGameId(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <button
                                className="btn-gen"
                                onClick={e => {
                                    e.preventDefault();
                                    setGameId(Date.now())
                                }}
                            >
                                Create Game Id
                            </button>
                            <p>{gameId}</p>
                        </>
                    )
                }
                </div>
                <button type="submit" className="btn-ready">Start Game</button>
            </form>
        </>
    );
};

export default Login;