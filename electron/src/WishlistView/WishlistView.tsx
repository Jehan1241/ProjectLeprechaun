import React, { useRef, useState, useEffect } from "react";
import GridMaker from "@/LibraryView/GridMaker";
import { useSortContext } from "@/SortContext";
import { ChevronDown, ChevronUp, Grid2X2, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetialsMaker from "@/LibraryView/DetailsMaker";

interface wishlistViewProps {
    data: any[];
}

export default function WishlistView({ data }: wishlistViewProps) {
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
            localStorage.setItem("wishlistGridScrollPosition", currentScrollPos.toString());
            setGridScrollPosition(currentScrollPos);
        }

        if (listScrollRef.current) {
            const currentScrollPos = listScrollRef.current.scrollTop;
            localStorage.setItem("wishlistListScrollPosition", currentScrollPos.toString());
            setListScrollPosition(currentScrollPos);
        }
    };

    useEffect(() => {
        const savedGridScrollPos = localStorage.getItem("wishlistGridScrollPosition");
        const savedListScrollPos = localStorage.getItem("wishlistListScrollPosition");

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
        <div className="flex absolute flex-col justify-center w-full h-full">
            <div className="flex justify-between items-center p-2 mx-5 text-xl font-bold tracking-wide">
                <div className="flex gap-2 items-center">Wishlist</div>
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
                    className="flex overflow-y-auto flex-wrap gap-8 justify-center pt-4 pb-10 w-full h-full select-none"
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
                    className="overflow-y-auto pt-4 mb-5 w-full h-full select-none"
                >
                    <div className="flex gap-4 justify-between px-5 mx-10 h-10 rounded-sm bg-background">
                        <div className="flex justify-center items-center w-1/4">
                            <Button
                                onClick={() => {
                                    handleSortChange("CustomTitle");
                                }}
                                variant={"ghost"}
                                className="w-full h-8"
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
                        <div className="flex justify-center items-center w-60 text-center bg-transparent">
                            <Button
                                onClick={() => {
                                    handleSortChange("OwnedPlatform");
                                }}
                                variant={"ghost"}
                                className="w-full h-8"
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
                        <div className="flex justify-center items-center w-60 text-center">
                            <Button
                                variant={"ghost"}
                                className="w-full h-8"
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
                        <div className="flex justify-center items-center w-60 text-center cursor-pointer">
                            <Button
                                onClick={() => {
                                    handleSortChange("CustomTimePlayed");
                                }}
                                variant={"ghost"}
                                className="w-full h-8"
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
                        <div className="flex justify-center items-center w-60 text-center">
                            <Button
                                onClick={() => {
                                    handleSortChange("CustomReleaseDate");
                                }}
                                variant={"ghost"}
                                className="w-full h-8"
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
