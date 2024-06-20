import { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBar";
import LibraryView from "./LibraryView/LibraryView";
import { Route, Routes, useLocation } from "react-router-dom";
import AddGameManually from "./AddGameManually/AddGameManually";
import AddGameSteam from "./AddGameSteam/AddGameSteam";
import GameView from "./GameView/GameView";

function App() {
  const [metaData, setMetaData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const state = location.state;
  const [tileSize, setTileSize] = useState("");

  const NavBarInputChangeHanlder = (e) => {
    const text = e.target.value;
    setSearchText(text.toLowerCase());
  };

  /* To initially set Tile Size to 25 */
  useEffect(() => {
    setTileSize(40);
  }, []);

  const sizeChangeHandler = (e) => {
    setTileSize(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/getBasicInfo");
      const json = await response.json();
      setMetaData(json.MetaData);
      console.log(json.Screenshots);
      console.log("Run");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const DataArray = Object.values(metaData);

  return (
    <div className="flex flex-col w-screen h-screen bg-gameView">
      <NavBar
        inputChangeHandler={NavBarInputChangeHanlder}
        sizeChangeHandler={sizeChangeHandler}
      />
      <Routes>
        <Route
          element={
            <LibraryView
              tileSize={tileSize}
              searchText={searchText}
              data={DataArray}
            />
          }
          path="/"
        />
        <Route
          element={<AddGameManually onGameAdded={fetchData} />}
          path="AddGameManually"
        />
        <Route element={<AddGameSteam />} path="AddGameSteam" />
        <Route element={<GameView uid={state?.data} />} path="gameview" />
        {/* {DataArray.map((item) => (
          <Route
            element={
              <>
                <img
                  className="absolute top-0 right-0 w-screen h-screen opacity-20 blur-md"
                  src={
                    "http://localhost:8080/screenshots/" +
                    Object.values(screenshots[item.UID])
                  }
                />
                <GameView
                  screenshots={
                    screenshots[item.UID] ? screenshots[item.UID] : {}
                  }
                  companies={companies[item.UID] ? companies[item.UID] : {}}
                  tags={tags[item.UID] ? tags[item.UID] : {}}
                  data={item}
                />
              </>
            }
            path={`/GameView/${item.UID}`}
          />
        ))} */}
      </Routes>
    </div>
  );
}

export default App;
