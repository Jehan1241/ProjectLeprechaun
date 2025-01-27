import { useSortContext } from "@/SortContext";
import React from "react";
import DetialsMaker from "./DetailsMaker";
import {
    ArrowBigDown,
    ArrowDown,
    ArrowDown10,
    ArrowDown10Icon,
    ChevronDown,
    ArrowDownIcon,
    ArrowUp10Icon,
    ChevronUp,
    ChevronUpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailsViewProps {
    data: any[];
}

export default function DetialsView({ data }: DetailsViewProps) {
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

    return (
        <div className="h-full w-full justify-center overflow-y-auto">
            <div className="mb-5 mt-1 flex select-none flex-col justify-center gap-1">
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
        </div>
    );
}
