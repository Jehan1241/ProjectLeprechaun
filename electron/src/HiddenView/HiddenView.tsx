import { Button } from "@/components/ui/button";
import DetialsMaker from "@/LibraryView/DetailsMaker";
import GridMaker from "@/LibraryView/GridMaker";
import { useSortContext } from "@/SortContext";
import { ChevronDown, ChevronUp, Grid2X2, ListIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface hiddenViewProps {
    data: any[];
}

export default function HiddenView({ data }: hiddenViewProps) {
    const [view, setView] = useState<string | null>(null);
    const gridScrollRef = useRef<HTMLDivElement | null>(null);
    const listScrollRef = useRef<HTMLDivElement | null>(null);
    const [gridScrollPosition, setGridScrollPosition] = useState(0);
    const [listScrollPosition, setListScrollPosition] = useState(0);
    const { searchText, sortType, sortOrder, setSortOrder, setSortType, setSortStateUpdate } =
        useSortContext();

    const handleSortChange = (incomingSort: string) => {
        if (incomingSort != sortType) {
            setSortType(incomingSort);
        } else {
            if (sortOrder == "ASC") {
                setSortOrder("DESC");
            }
            if (sortOrder == "DESC") {
                setSortOrder("ASC");
            }
        }
        setSortStateUpdate(true);
    };

    const scrollHandler = () => {
        if (gridScrollRef.current) {
            const currentScrollPos = gridScrollRef.current.scrollTop;
            localStorage.setItem("hiddenGridScrollPosition", currentScrollPos.toString());
            setGridScrollPosition(currentScrollPos);
        }

        if (listScrollRef.current) {
            const currentScrollPos = listScrollRef.current.scrollTop;
            localStorage.setItem("hiddenListScrollPosition", currentScrollPos.toString());
            setListScrollPosition(currentScrollPos);
        }
    };

    useEffect(() => {
        const savedGridScrollPos = localStorage.getItem("hiddenGridScrollPosition");
        const savedListScrollPos = localStorage.getItem("hiddenListScrollPosition");

        if (view === "grid" && savedGridScrollPos !== null && gridScrollRef.current) {
            const scrollPosition = parseInt(savedGridScrollPos, 10);
            gridScrollRef.current.scrollTop = scrollPosition;
            setGridScrollPosition(scrollPosition);
        } else if (view === "list" && savedListScrollPos !== null && listScrollRef.current) {
            const scrollPosition = parseInt(savedListScrollPos, 10);
            listScrollRef.current.scrollTop = scrollPosition;
            setListScrollPosition(scrollPosition);
        }
        const layout = localStorage.getItem("layout");
        if (layout) {
            setView(layout);
        } else {
            setView("grid");
        }
    }, [view]);

    return (
        <div className="absolute flex h-full w-full flex-col justify-center">
            <div className="mx-5 flex items-center justify-between p-2 text-xl font-bold tracking-wide">
                <div className="flex items-center gap-2">Hidden Games</div>
                <div className="flex gap-2">
                    <Button
                        className={`h-8 w-8 ${view === "grid" ? "border-2 border-border" : ""}`}
                        onClick={() => {
                            setView("grid");
                            localStorage.setItem("layout", "grid");
                        }}
                        variant={"ghost"}
                    >
                        <Grid2X2 strokeWidth={1.7} size={20} />
                    </Button>
                    <Button
                        className={`h-8 w-8 ${view === "list" ? "border-2 border-border" : ""}`}
                        onClick={() => {
                            setView("list");
                            localStorage.setItem("layout", "list");
                        }}
                        variant={"ghost"}
                    >
                        <ListIcon size={20} />
                    </Button>
                </div>
            </div>
            {view === "grid" && (
                <div
                    onScroll={scrollHandler}
                    ref={gridScrollRef}
                    className="flex h-full w-full select-none flex-wrap justify-center gap-8 overflow-y-auto pb-10 pt-4"
                >
                    {data.map((item, key) => {
                        const cleanedName = item.Name.toLowerCase()
                            .replace("'", "")
                            .replace("’", "")
                            .replace("®", "")
                            .replace("™", "")
                            .replace(":", "");
                        if (cleanedName.includes(searchText.replace("'", "").toLocaleLowerCase())) {
                            return (
                                <GridMaker
                                    cleanedName={cleanedName}
                                    key={item.UID}
                                    name={item.Name}
                                    cover={item.CoverArtPath}
                                    uid={item.UID}
                                    platform={item.OwnedPlatform}
                                    hidden={true}
                                />
                            );
                        }
                    })}
                </div>
            )}
            {view === "list" && (
                <div
                    onScroll={scrollHandler}
                    ref={listScrollRef}
                    className="mb-5 h-full w-full select-none overflow-y-auto pt-4"
                >
                    <div className="mx-10 flex h-10 justify-between gap-4 rounded-sm bg-background px-5">
                        <div className="flex w-1/4 items-center justify-center">
                            <Button
                                onClick={() => {
                                    handleSortChange("CustomTitle");
                                }}
                                variant={"ghost"}
                                className="h-8 w-full"
                            >
                                Title
                                {sortType == "CustomTitle" && sortOrder == "DESC" && (
                                    <ChevronDown className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                                {sortType == "CustomTitle" && sortOrder == "ASC" && (
                                    <ChevronUp className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                            </Button>
                        </div>
                        <div className="flex w-60 items-center justify-center bg-transparent text-center">
                            <Button
                                onClick={() => {
                                    handleSortChange("OwnedPlatform");
                                }}
                                variant={"ghost"}
                                className="h-8 w-full"
                            >
                                Platform
                                {sortType == "OwnedPlatform" && sortOrder == "DESC" && (
                                    <ChevronDown size={22} strokeWidth={0.9} />
                                )}
                                {sortType == "OwnedPlatform" && sortOrder == "ASC" && (
                                    <ChevronUp size={22} strokeWidth={0.9} />
                                )}
                            </Button>
                        </div>
                        <div className="flex w-60 items-center justify-center text-center">
                            <Button
                                variant={"ghost"}
                                className="h-8 w-full"
                                onClick={() => {
                                    handleSortChange("CustomRating");
                                }}
                            >
                                Rating
                                {sortType == "CustomRating" && sortOrder == "DESC" && (
                                    <ChevronDown className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                                {sortType == "CustomRating" && sortOrder == "ASC" && (
                                    <ChevronUp className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                            </Button>
                        </div>
                        <div className="flex w-60 cursor-pointer items-center justify-center text-center">
                            <Button
                                onClick={() => {
                                    handleSortChange("CustomTimePlayed");
                                }}
                                variant={"ghost"}
                                className="h-8 w-full"
                            >
                                Hours Played
                                {sortType == "CustomTimePlayed" && sortOrder == "DESC" && (
                                    <ChevronDown className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                                {sortType == "CustomTimePlayed" && sortOrder == "ASC" && (
                                    <ChevronUp className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                            </Button>
                        </div>
                        <div className="flex w-60 items-center justify-center text-center">
                            <Button
                                onClick={() => {
                                    handleSortChange("CustomReleaseDate");
                                }}
                                variant={"ghost"}
                                className="h-8 w-full"
                            >
                                Release Date
                                {sortType == "CustomReleaseDate" && sortOrder == "DESC" && (
                                    <ChevronDown className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                                {sortType == "CustomReleaseDate" && sortOrder == "ASC" && (
                                    <ChevronUp className="mx-2" size={22} strokeWidth={0.9} />
                                )}
                            </Button>
                        </div>
                    </div>
                    {data.map((item, key) => {
                        const cleanedName = item.Name.toLowerCase()
                            .replace("'", "")
                            .replace("’", "")
                            .replace("®", "")
                            .replace("™", "")
                            .replace(":", "");
                        if (cleanedName.includes(searchText.replace("'", "").toLocaleLowerCase())) {
                            return (
                                <DetialsMaker
                                    cleanedName={cleanedName}
                                    key={item.UID}
                                    name={item.Name}
                                    cover={item.CoverArtPath}
                                    uid={item.UID}
                                    platform={item.OwnedPlatform}
                                    timePlayed={item.TimePlayed}
                                    rating={item.AggregatedRating}
                                    releaseDate={item.ReleaseDate}
                                />
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
}
