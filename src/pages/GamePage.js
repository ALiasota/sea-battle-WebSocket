import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Board } from "../mosels/Board";
import BoardComponent from "../components/BoardComponent";
import ActionsInfo from "../components/ActionsInfo";

const wss = new WebSocket('ws://localhost:4000');

const GamePage = () => {
    const [myBoard, setMyBoard] = useState(new Board());
    const [hisBoard, setHisBoard] = useState(new Board());
    const [rivalName, setRivalName] = useState('');
    const [shipsReady, setShipsReady] = useState(false);
    const [canShoot, setCanShoot] = useState(false);

    const navigate = useNavigate();

    const { gameId } = useParams();

    useEffect(() => {
        wss.send(JSON.stringify({ event: 'connect', payload: { username: localStorage.nickName, gameId } }))
        restart();
    }, [gameId]);

    function restart() {
        const newMyBoard = new Board();
        const newHisBoard = new Board();
        newMyBoard.initCells();
        newHisBoard.initCells();
        setMyBoard(newMyBoard);
        setHisBoard(newHisBoard);
    }

    function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
        isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y);
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    wss.onmessage = function(response) {
        const { type, payload } = JSON.parse(response.data);
        const { username, x, y, canStart, rivalName, success } = payload;
        console.log(payload)
        switch (type) {
            case 'connectToPlay':
                if (!success) {
                    return navigate('/')
                }
                setRivalName(rivalName);
                break;
            case 'readyToPlay':
                if (payload.username === localStorage.nickName && canStart) {
                    setCanShoot(true);
                }
                break;
            case 'afterShootByMe':
                if (username !== localStorage.nickName) {
                    const isPerfectHit = myBoard.cells[y][x].mark?.name === 'ship';
                    changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit);
                    wss.send(JSON.stringify({ event: 'checkShoot', payload: { ...payload, isPerfectHit } }));
                    if (!isPerfectHit) {
                        setCanShoot(true);
                    }

                }
                break;
            case 'isPerfectHit':
                if (username === localStorage.nickName) {
                    changeBoardAfterShoot(hisBoard, setHisBoard, x, y, payload.isPerfectHit);
                    payload.isPerfectHit ? setCanShoot(true) : setCanShoot(false);
                    break;
                }
                break;
            default:
            break;
        }
    }

    function shoot(x, y) {
        wss.send(JSON.stringify({ event: 'shoot', payload: { username: localStorage.nickName, x, y, gameId } }));
    }

    function ready() {
        wss.send(JSON.stringify({ event: 'ready', payload: { username: localStorage.nickName, gameId } }));
        setShipsReady(true);
    }

    return (
        <>
            <p>Welcome in the Game</p>
            <div className="broads-container">
                <div>
                    <p className="nick">{localStorage.nickName}</p>
                    <BoardComponent 
                        board={myBoard}
                        isMyBoard
                        setBoard={setMyBoard}
                        canShoot={false}
                        shipsReady={shipsReady}
                    />
                </div>
                <div>
                    <p className="nick">{rivalName || 'Rival'}</p>
                    <BoardComponent 
                        board={hisBoard}
                        canShoot={canShoot}
                        shoot={shoot}
                        shipsReady={shipsReady}
                        setBoard={setHisBoard}
                    />
                </div>
            </div>
            <ActionsInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady}/>
        </>
    );
};

export default GamePage;