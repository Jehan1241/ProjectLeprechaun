import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSortContext } from "@/SortContext";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
    CalendarIcon,
    Globe,
    Link,
    Loader2,
    LucideArrowLeft,
    LucideArrowRight,
    Trash2,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import MultipleSelector from "@/components/ui/multiple-selector";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { number } from "zod";

export default function AddGameManuallyDialog() {
    const { isAddGameDialogOpen, setIsAddGameDialogOpen } = useSortContext();

    // State variables
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [releaseDate, setReleaseDate] = useState<any>("");
    const [rating, setRating] = useState<any>("");
    const [developers, setDevelopers] = useState<any>("");
    const [timePlayed, setTimePlayed] = useState<any>("");
    const [description, setDescription] = useState<any>("");

    return (
        <Dialog open={isAddGameDialogOpen} onOpenChange={setIsAddGameDialogOpen}>
            <DialogContent className="block h-[75vh] max-h-[75vh] max-w-[75vw]">
                <DialogHeader className="h-full max-h-full">
                    <DialogTitle>Add a Game</DialogTitle>
                    <MetaDataView
                        data={data}
                        setData={setData}
                        loading={loading}
                        setLoading={setLoading}
                        title={title}
                        setTitle={setTitle}
                        releaseDate={releaseDate}
                        setReleaseDate={setReleaseDate}
                        rating={rating}
                        setRating={setRating}
                        developers={developers}
                        setDevelopers={setDevelopers}
                        timePlayed={timePlayed}
                        setTimePlayed={setTimePlayed}
                        description={description}
                        setDescription={setDescription}
                    />
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function MetaDataView({
    data,
    setData,
    loading,
    setLoading,
    title,
    setTitle,
    releaseDate,
    setReleaseDate,
    rating,
    setRating,
    developers,
    setDevelopers,
    timePlayed,
    setTimePlayed,
    description,
    setDescription,
}: {
    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    releaseDate: any;
    setReleaseDate: React.Dispatch<React.SetStateAction<any>>;
    rating: any;
    setRating: React.Dispatch<React.SetStateAction<any>>;
    developers: any;
    setDevelopers: React.Dispatch<React.SetStateAction<any>>;
    timePlayed: any;
    setTimePlayed: React.Dispatch<React.SetStateAction<any>>;
    description: any;
    setDescription: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [tagOptions, setTagOptions] = useState([]);
    const [devOptions, setDevOptions] = useState([]);
    const [platformOptions, setPlatformOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedDevs, setSelectedDevs] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<any[]>([]);
    const [titleEmpty, setTitleEmpty] = useState(false);
    const [releaseDateEmpty, setReleaseDateEmpty] = useState(false);
    const [platformEmpty, setPlatformEmpty] = useState(false);
    const [gameInsertError, setGameInsertError] = useState<any>(null);
    const [addGameLoading, setAddGameLoading] = useState(false);

    const fetchData = async (title: string) => {
        try {
            const response = await fetch(`http://localhost:8080/IGDBsearch`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    NameToSearch: title,
                    clientID: "bg50w140115zmfq2pi0uc0wujj9pn6",
                    clientSecret: "1nk95mh97tui5t1ct1q5i7sqyfmqvd",
                }),
            });
            const resp = await response.json();
            setData(resp.foundGames);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTagsDevsPlatforms = async () => {
        try {
            const response = await fetch("http://localhost:8080/getAllTags");
            const resp = await response.json();

            // Transform the tags into key-value pairs
            const tagsAsKeyValuePairs = resp.tags.map((tag: any) => ({
                value: tag,
                label: tag,
            }));

            setTagOptions(tagsAsKeyValuePairs);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
        try {
            const response = await fetch("http://localhost:8080/getAllDevelopers");
            const resp = await response.json();
            console.log(resp);

            // Transform the tags into key-value pairs
            const devsAsKeyValuePairs = resp.devs.map((dev: any) => ({
                value: dev,
                label: dev,
            }));

            setDevOptions(devsAsKeyValuePairs);
        } catch (error) {
            console.error("Error fetching developers:", error);
        }
        try {
            const response = await fetch("http://localhost:8080/getAllPlatforms");
            const resp = await response.json();
            console.log(resp);

            // Transform the tags into key-value pairs
            const platsAsKeyValuePairs = resp.platforms.map((plat: any) => ({
                value: plat,
                label: plat,
            }));

            setPlatformOptions(platsAsKeyValuePairs);
        } catch (error) {
            console.error("Error fetching developers:", error);
        }
    };

    useEffect(() => {
        console.log("Fetching tags, dev, platforms...");
        fetchTagsDevsPlatforms();
    }, []);

    useEffect(() => {
        if (data) {
            console.log("Found games:", data);
        }
    }, [data]); // Runs every time data is updated

    const downloadIgdbMetadata = () => {
        const titleElement = document.getElementById("title") as HTMLInputElement | null;
        if (titleElement) {
            const title = titleElement.value;
            console.log(title);
            setLoading(true);
            fetchData(title);
        }
    };

    const [date, setDate] = React.useState<Date>();

    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [ssImage, setSsImage] = useState<(string | null)[]>([null]); // Three empty image slots
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // To track selected carousel item
    const [coverArtLinkClicked, setCoverArtLinkClicked] = useState<boolean>(false); // To track selected carousel item
    const [ssLinkClicked, setSSLinkClicked] = useState<number | null>(null);

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set the base64 result as the image source
                setCoverImage(reader.result as string); // Cast to 'string' since 'result' can be a string or null
            };
            reader.readAsDataURL(file);
        } else {
            // If no file is selected (user cancels), clear the image
            setCoverImage(null);
        }
    };

    const handleDeleteCoverArt = () => {
        setCoverImage(null);
    };

    const handleScreenshotImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedScreenshots = [...(ssImage || [])]; // Create a new array from ssImage or empty array
                updatedScreenshots[index] = reader.result as string; // Ensure the result is a string for the data URL
                console.log("Updated Screenshot Array:", updatedScreenshots); // Add a log to debug the updated state
                setSsImage(updatedScreenshots); // Update the state with the new array
            };
            reader.readAsDataURL(file);
        }
    };

    // Add a new screenshot entry to the carousel
    const addScreenshot = () => {
        // First, update the state to add a new screenshot slot
        setSsImage((prev) => {
            const updatedScreenshots = [...(prev || []), null]; // Add a new `null` entry
            return updatedScreenshots; // Return the updated screenshots array
        });

        // Use setTimeout to delay the scrolling, ensuring it happens after the state update
        setTimeout(() => {
            const lastIndex = ssImage.length; // Using the state length as the new index
            if (api) {
                api.scrollTo(lastIndex); // Scroll to the last item
            }
        }, 0); // 0ms delay ensures it happens after the state is updated
    };

    const handleDeleteScreenshot = () => {
        // Ensure selectedIndex is a valid number, falling back to 0 if it's null or undefined
        const indexToDelete = selectedIndex ?? 0;

        const updatedScreenshots = [...(ssImage || [])];

        // Only proceed with deletion if there are screenshots to delete
        if (updatedScreenshots.length > 0) {
            api?.scrollPrev();
            setTimeout(() => {
                updatedScreenshots.splice(indexToDelete, 1); // Remove the screenshot at the active index
                setSsImage(updatedScreenshots);
                if (selectedIndex) {
                    setSelectedIndex(selectedIndex - 1);
                }
            }, 500); // 500ms delay to see the full scroll before slide is deleted
        }
    };
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", (e) => {
            setSelectedIndex(e.selectedScrollSnap());
        });
    }, [api]);

    const addGameClickHandler = () => {
        if (title == "") {
            setTitleEmpty(true);
            console.log("empty");
        }
        if (!releaseDate) {
            setReleaseDateEmpty(true);
            console.log("empty");
        }
        if (selectedPlatforms.length === 0) {
            setPlatformEmpty(true);
            console.log("empty");
        }
        if (title != "" && releaseDate && selectedPlatforms.length != 0) {
            let ratingNormal = rating;

            // Check if the rating is a valid number, and convert it to a string if necessary
            if (ratingNormal === "" || isNaN(ratingNormal)) {
                ratingNormal = "0";
            } else {
                ratingNormal = String(ratingNormal);
            }

            let timePlayedNormal = timePlayed;

            if (timePlayedNormal == "") {
                timePlayedNormal = "0";
            }
            console.log(ratingNormal);

            setTitleEmpty(false);
            setReleaseDateEmpty(false);
            setPlatformEmpty(false);
            sendGameToDB(
                title,
                releaseDate,
                selectedPlatforms,
                timePlayedNormal,
                ratingNormal,
                selectedDevs,
                selectedTags,
                description,
                coverImage,
                ssImage
            );
        }
    };

    const sendGameToDB = async (
        title: string,
        releaseDate: any,
        selectedPlatforms: any,
        timePlayed: any,
        rating: any,
        selectedDevs: any,
        selectedTags: any,
        description: string,
        coverImage: any,
        ssImage: any
    ) => {
        try {
            setAddGameLoading(true);
            const response = await fetch(`http://localhost:8080/addGameToDB`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    releaseDate: releaseDate,
                    selectedPlatforms: selectedPlatforms,
                    timePlayed: timePlayed,
                    rating: rating,
                    selectedDevs: selectedDevs,
                    selectedTags: selectedTags,
                    description: description,
                    coverImage: coverImage,
                    ssImage: ssImage,
                }),
            });
            const resp = await response.json();
            if (resp.insertionStatus === false) {
                console.log(resp.insertionStatus);
                setGameInsertError(true);
            }
            if (resp.insertionStatus === true) {
                console.log(resp.insertionStatus);
                setGameInsertError(false);
            }
        } catch (error) {
            console.error(error);
            setAddGameLoading(false);
        }
        setAddGameLoading(false);
    };
    const { toast } = useToast();

    useEffect(() => {
        if (gameInsertError === true) {
            toast({
                variant: "destructive",
                title: "Game Insertion Error!",
                description: "This game has already been inserted.",
            });
            setGameInsertError(null);
        } else if (gameInsertError === false) {
            toast({
                variant: "default",
                title: "Game Added!",
                description: "The game has been added to the database.",
            });
            setGameInsertError(null);
        }
    }, [gameInsertError]);

    return (
        <div className="flex h-full max-h-full w-full gap-4 overflow-hidden">
            <div className="flex h-full w-full flex-col">
                <DialogDescription
                    className={`${
                        titleEmpty || platformEmpty || releaseDateEmpty ? "text-destructive" : null
                    }`}
                >
                    {titleEmpty || platformEmpty || releaseDateEmpty
                        ? "Please fill all required fields"
                        : "  Enter the game metadata manually or download it from IGDB."}
                </DialogDescription>
                <div className="mb-2 grid grid-cols-1 gap-4 overflow-y-auto p-2 py-4 2xl:grid-cols-2">
                    <div className="flex items-center gap-4 text-sm">
                        <label className={`min-w-24 ${titleEmpty ? "text-destructive" : null}`}>
                            {titleEmpty && "*"}
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setTitleEmpty(false);
                            }}
                            placeholder={"Enter Title"}
                            className="col-span-3"
                            spellCheck={false}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    downloadIgdbMetadata();
                                }
                            }}
                        />
                        <Button
                            disabled={loading}
                            type="submit"
                            variant={"secondary"}
                            onClick={downloadIgdbMetadata}
                            className="h-10"
                        >
                            {loading && <Loader2 className="animate-spin" />}
                            Download Metadata
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <label
                            className={`min-w-24 ${releaseDateEmpty ? "text-destructive" : null}`}
                        >
                            {titleEmpty && "*"}
                            Release Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "col-span-3 w-full justify-start text-left font-normal",
                                        !releaseDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon size={20} strokeWidth={1} />
                                    {releaseDate ? (
                                        format(releaseDate, "yyyy-MM-dd")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="col-span-3 w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={releaseDate}
                                    onSelect={(e) => {
                                        setReleaseDate(e);
                                        setReleaseDateEmpty(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <label className={`min-w-24 ${platformEmpty ? "text-destructive" : null}`}>
                            {platformEmpty && "*"}
                            Platform
                        </label>
                        <MultipleSelector
                            maxSelected={1}
                            options={platformOptions}
                            placeholder="Select Platforms"
                            creatable
                            className="max-h-40 overflow-y-scroll"
                            hidePlaceholderWhenSelected={true}
                            value={selectedPlatforms}
                            onChange={(e: any) => {
                                setSelectedPlatforms(e);
                                setPlatformEmpty(false);
                            }}
                            emptyIndicator={
                                <p className="text-center text-sm">no results found.</p>
                            }
                        />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <label className="min-w-24">Rating</label>
                        <Input
                            type="text"
                            value={rating}
                            onChange={(e) => {
                                const value = e.target.value;

                                // If the value is 100, don't allow a decimal point to be added
                                if (value === "100") {
                                    setRating(value); // Keep it as "100" without a decimal point
                                } else {
                                    // Allow only digits with at most two decimal places and ensure the value is between 0 and 100
                                    if (
                                        /^\d*\.?\d{0,2}$/.test(value) &&
                                        parseFloat(value) <= 100 &&
                                        parseFloat(value) >= 0
                                    ) {
                                        setRating(value);
                                    } else if (value === "") {
                                        setRating(""); // Allow clearing the input
                                    }
                                }
                            }}
                            placeholder="Rating"
                            className="col-span-3"
                            inputMode="decimal" // Use the numeric keypad with decimal point on mobile devices
                        />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <label className="min-w-24">Developers</label>
                        <MultipleSelector
                            options={devOptions}
                            placeholder="Select Developers"
                            creatable
                            className="max-h-40 overflow-y-scroll"
                            hidePlaceholderWhenSelected={true}
                            value={selectedDevs}
                            onChange={(e: any) => {
                                setSelectedDevs(e);
                            }}
                            emptyIndicator={
                                <p className="text-center text-sm">no results found.</p>
                            }
                        />
                    </div>
                    <div className="row-span-2 flex h-full w-full grow-0 items-start gap-4 text-sm">
                        <label className="min-w-24">Tags</label>
                        <div className="h-full max-h-24 flex-1">
                            <MultipleSelector
                                options={tagOptions}
                                placeholder="Select Tags"
                                creatable
                                className="h-full max-h-full w-full overflow-y-scroll"
                                hidePlaceholderWhenSelected={true}
                                onChange={(e: any) => {
                                    setSelectedTags(e);
                                }}
                                value={selectedTags}
                                emptyIndicator={
                                    <p className="text-center text-sm">no results found.</p>
                                }
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <label className="min-w-24">Time Played</label>
                        <Input
                            value={timePlayed}
                            onChange={(e) => {
                                const value = e.target.value;

                                // Allow only positive numbers with up to two decimal points
                                if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0) {
                                    setTimePlayed(value);
                                } else if (value === "") {
                                    setTimePlayed(""); // Allow clearing the input
                                }
                            }}
                            id="username"
                            placeholder="Enter time played in hours"
                            className="col-span-3"
                            inputMode="decimal"
                        />
                    </div>
                    <div className="flex items-start gap-4 text-sm 2xl:col-span-2">
                        <label className="mt-2 min-w-24">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            spellCheck={false}
                        ></Textarea>
                    </div>

                    <div className="flex items-start gap-4 text-sm">
                        <label className="mt-2 min-w-24">Cover Art</label>
                        <div className="flex w-full gap-2">
                            <input
                                hidden
                                id="cover-picture"
                                type="file"
                                onChange={handleCoverImageChange}
                            />

                            <label htmlFor="cover-picture" className="w-60 cursor-pointer">
                                <Card className="flex h-[calc(15rem*4/3)] w-60 select-none items-center justify-center overflow-hidden">
                                    <CardContent className="m-0 p-0">
                                        {coverImage ? (
                                            <img
                                                draggable={false}
                                                src={coverImage}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            "Choose an Image"
                                        )}
                                    </CardContent>
                                </Card>
                            </label>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant={"outline"}
                                    className="h-8 w-8 rounded-full"
                                    onClick={handleDeleteCoverArt}
                                >
                                    <Trash2 size={18} />
                                </Button>
                                <div className="flex gap-1">
                                    <Button
                                        variant={"outline"}
                                        onClick={() => {
                                            setCoverArtLinkClicked(!coverArtLinkClicked);
                                        }}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <Link size={18} />
                                    </Button>
                                    {coverArtLinkClicked && (
                                        <Input
                                            placeholder="Paste link and press Enter"
                                            className="h-8 rounded-full"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const inputElement =
                                                        e.target as HTMLInputElement; // Type cast to HTMLInputElement
                                                    setCoverImage(inputElement.value); // Access value
                                                }
                                            }}
                                        ></Input>
                                    )}
                                </div>
                                <Button
                                    variant={"outline"}
                                    className="h-8 w-8 rounded-full"
                                    onClick={addScreenshot}
                                >
                                    <Globe size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 text-sm">
                        <label className="mt-2 min-w-24">Screenshots</label>
                        <div className="flex w-full flex-col">
                            <Carousel setApi={setApi} className="flex max-w-lg justify-center">
                                <CarouselContent className="h-full w-full">
                                    {ssImage?.map((image, index) => (
                                        <CarouselItem key={index} className="h-full w-full">
                                            <input
                                                hidden
                                                id={`ss-picture-${index}`} // Unique ID for each screenshot input
                                                type="file"
                                                onChange={(e) =>
                                                    handleScreenshotImageChange(index, e)
                                                }
                                            />
                                            <div
                                                className="h-full w-full cursor-pointer"
                                                onClick={() => {
                                                    const fileInput = document.getElementById(
                                                        `ss-picture-${index}`
                                                    ) as HTMLInputElement | null;
                                                    if (fileInput) {
                                                        fileInput.click();
                                                    }
                                                }}
                                            >
                                                <Card className="h-full w-full">
                                                    <CardContent className="flex h-full w-full select-none items-center justify-center p-0">
                                                        <AspectRatio
                                                            ratio={16 / 9}
                                                            className="flex items-center justify-center rounded-md border-b border-border"
                                                        >
                                                            {image ? (
                                                                <img
                                                                    draggable={false}
                                                                    src={image}
                                                                    alt="Broken Image"
                                                                    className="h-full rounded-md"
                                                                />
                                                            ) : (
                                                                "Click to choose image"
                                                            )}
                                                        </AspectRatio>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="mt-1 flex justify-between gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant={"outline"}
                                            onClick={addScreenshot}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Plus size={18} />
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            onClick={handleDeleteScreenshot}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            onClick={addScreenshot}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <Globe size={18} />
                                        </Button>
                                        <div className="flex gap-1">
                                            <Button
                                                variant={"outline"}
                                                onClick={() => {
                                                    const scrollpoint = api?.selectedScrollSnap();
                                                    if (scrollpoint != null) {
                                                        setSSLinkClicked(scrollpoint);
                                                        if (scrollpoint == ssLinkClicked) {
                                                            setSSLinkClicked(null);
                                                        }
                                                    }
                                                }}
                                                className="h-8 w-8 rounded-full"
                                            >
                                                <Link size={18} />
                                            </Button>
                                            {ssLinkClicked != null ? (
                                                <Input
                                                    className="mx-2 h-8 rounded-full"
                                                    placeholder="Paste link and press Enter"
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" &&
                                                            selectedIndex !== null
                                                        ) {
                                                            const link = (
                                                                e.target as HTMLInputElement
                                                            ).value; // Typecast to HTMLInputElement

                                                            // Ensure it's a valid link before updating
                                                            const updatedScreenshots = [...ssImage];
                                                            updatedScreenshots[selectedIndex] =
                                                                link; // Set the link at the selected index
                                                            console.log(updatedScreenshots);
                                                            setSsImage(updatedScreenshots); // Update the state with the new array
                                                            setSSLinkClicked(null);
                                                        }
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="mr-4 flex gap-2">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                api?.scrollPrev();
                                                setSSLinkClicked(null);
                                            }}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <LucideArrowLeft size={18} />
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                api?.scrollNext();
                                                setSSLinkClicked(null);
                                            }}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <LucideArrowRight size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="mt-auto flex justify-end">
                    <Button
                        className="h-12 w-60"
                        type="submit"
                        onClick={addGameClickHandler}
                        variant={"secondary"}
                    >
                        Add Game {addGameLoading && <Loader2 className="animate-spin" />}
                    </Button>
                </div>
            </div>
            <div className="flex h-full max-h-full">
                <FoundGames
                    data={data}
                    setData={setData}
                    title={title}
                    releaseDate={releaseDate}
                    rating={rating}
                    developers={developers}
                    timePlayed={timePlayed}
                    description={description}
                    setTitle={setTitle}
                    setReleaseDate={setReleaseDate}
                    setRating={setRating}
                    setDevelopers={setDevelopers}
                    setTimePlayed={setTimePlayed}
                    setDescription={setDescription}
                    tagOptions={tagOptions}
                    setTagOptions={setTagOptions}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    selectedDevs={selectedDevs}
                    setSelectedDevs={setSelectedDevs}
                    setCoverImage={setCoverImage}
                    setSsImage={setSsImage}
                />
            </div>
        </div>
    );
}

function FoundGames({
    data,
    setData,
    title,
    setTitle,
    releaseDate,
    setReleaseDate,
    rating,
    setRating,
    developers,
    setDevelopers,
    timePlayed,
    setTimePlayed,
    description,
    setDescription,
    tagOptions,
    setTagOptions,
    selectedTags,
    setSelectedTags,
    selectedDevs,
    setSelectedDevs,
    setCoverImage,
    setSsImage,
}: {
    data: any;
    setData: React.Dispatch<React.SetStateAction<string | null>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    releaseDate: any;
    setReleaseDate: React.Dispatch<React.SetStateAction<any>>;
    rating: any;
    setRating: React.Dispatch<React.SetStateAction<any>>;
    developers: any;
    setDevelopers: React.Dispatch<React.SetStateAction<any>>;
    timePlayed: any;
    setTimePlayed: React.Dispatch<React.SetStateAction<any>>;
    description: any;
    setDescription: React.Dispatch<React.SetStateAction<any>>;
    tagOptions: { value: string; label: string }[];
    setTagOptions: React.Dispatch<React.SetStateAction<any>>;
    selectedTags: { value: string; label: string }[];
    setSelectedTags: React.Dispatch<React.SetStateAction<any>>;
    selectedDevs: { value: string; label: string }[];
    setSelectedDevs: React.Dispatch<React.SetStateAction<any>>;
    setCoverImage: React.Dispatch<React.SetStateAction<any>>;
    setSsImage: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [gameInfoLoading, setGameInfoLoading] = useState(false);
    const [loadingAppId, setLoadingAppId] = useState<string | null>(null);

    const IgdbGameClicked = async (appid: any) => {
        try {
            setGameInfoLoading(true);
            setLoadingAppId(appid);
            const response = await fetch("http://localhost:8080/GetIgdbInfo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    key: appid,
                }),
            });
            const data = await response.json();
            console.log(data);

            // Overrides prev set tags and devs
            const newTags = data.metadata.tags;
            const newDevs = data.metadata.involvedCompanies;

            const selectedTags = newTags.map((tag: string) => ({
                value: tag,
                label: tag,
            }));

            const selectedDevs = newDevs.map((dev: string) => ({
                value: dev,
                label: dev,
            }));

            // Update the tag options state with the newly selected tags
            setSelectedTags(selectedTags);
            setSelectedDevs(selectedDevs);

            // Set the other metadata states
            setTitle(data.metadata.name);
            setReleaseDate(data.metadata.releaseDate);
            setRating(data.metadata.aggregatedRating);
            setDescription(data.metadata.description);
            setCoverImage(data.metadata.cover);
            setSsImage(data.metadata.screenshots);
            setData(null);
            setGameInfoLoading(false);
            setLoadingAppId(null);
        } catch (error) {
            console.error("Error:", error);
            setGameInfoLoading(false);
            setLoadingAppId(null);
        }
    };

    console.log(data);
    let dataJSON = [];
    if (data) {
        dataJSON = JSON.parse(data);
    }
    if (data === null) {
        return;
    } else if (Object.keys(dataJSON).length === 0) {
        return <div className="bg-gameView flex w-60 justify-center text-left">No Games Found</div>;
    } else {
        return (
            <>
                <ScrollArea className="mt-4 flex">
                    <div className="flex flex-col gap-2 p-5">
                        {Object.values(dataJSON).map((game: any) => (
                            <Button
                                key={game.appid}
                                variant={"outline"}
                                className={`flex h-16 min-w-80 justify-between ${loadingAppId === game.appid ? "animate-pulse bg-black/10" : null}`}
                                onClick={() => IgdbGameClicked(game.appid)}
                            >
                                <div className="mb-auto flex flex-col gap-1">
                                    {game.name}
                                    {loadingAppId === game.appid && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                </div>
                                <div className="mt-auto">{new Date(game.date).getFullYear()}</div>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </>
        );
    }
}