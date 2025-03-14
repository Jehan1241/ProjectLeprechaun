import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function MetadataTab({ uid, fetchData }: any) {
  const [customTitleChecked, setCustomTitleChecked] = useState<
    CheckedState | undefined
  >(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [customTimeOffset, setCustomTimeOffset] = useState("");
  const [customTimeChecked, setCustomTimeChecked] = useState<
    CheckedState | undefined
  >(false);
  const [customTimeOffsetChecked, setCustomTimeOffsetChecked] = useState<
    CheckedState | undefined
  >(false);
  const [customReleaseDate, setCustomReleaseDate] = useState<Date>();
  const [customReleaseDateChecked, setCustomReleaseDateChecked] = useState<
    CheckedState | undefined
  >(false);
  const [customRating, setCustomRating] = useState("");
  const [customRatingChecked, setCustomRatingChecked] = useState<
    CheckedState | undefined
  >(false);
  const [loading, setLoading] = useState(false);

  const loadPreferences = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/LoadPreferences?uid=${uid}`
      );
      const json = await response.json();
      console.log(json);
      setCustomTime("0");
      setCustomTimeOffset("0");
      setCustomRating("0");
      setCustomTitle(json.preferences.title.value);
      if (json.preferences.time.value) {
        setCustomTime(json.preferences.time.value);
      }
      if (json.preferences.timeOffset.value) {
        setCustomTimeOffset(json.preferences.timeOffset.value);
      }
      if (json.preferences.rating.value) {
        console.log("A");
        setCustomRating(json.preferences.rating.value);
      }
      setCustomReleaseDate(json.preferences.releaseDate.value);

      if (json.preferences.title.checked == "1") {
        setCustomTitleChecked(true);
      }
      if (json.preferences.time.checked == "1") {
        setCustomTimeChecked(true);
      }
      if (json.preferences.timeOffset.checked == "1") {
        setCustomTimeOffsetChecked(true);
      }
      if (json.preferences.releaseDate.checked == "1") {
        setCustomReleaseDateChecked(true);
      }
      if (json.preferences.rating.checked == "1") {
        setCustomRatingChecked(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveClickHandler = () => {
    const postData = {
      customTitleChecked: customTitleChecked,
      customTitle: customTitle.trim(),
      customTimeChecked: customTimeChecked,
      customTime: customTime.trim() === "" ? "0" : customTime.trim(),
      customTimeOffsetChecked: customTimeOffsetChecked,
      customTimeOffset:
        customTimeOffset.trim() === "" ? "0" : customTimeOffset.trim(),
      customRatingChecked: customRatingChecked,
      customRating: customRating.trim() === "" ? "0" : customRating.trim(),
      customReleaseDateChecked: customReleaseDateChecked,
      customReleaseDate: customReleaseDate
        ? format(customReleaseDate, "yyyy-MM-dd")
        : "", // Empty string if undefined
      UID: uid,
    };
    savePreferences(postData);
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const handleCheckboxChange = (
    checked: CheckedState | undefined,
    title: string
  ) => {
    switch (title) {
      case "title":
        setCustomTitleChecked(checked);
        break;
      case "time":
        if (checked == false) {
          setCustomTimeChecked(false);
        } else {
          setCustomTimeChecked(true);
          setCustomTimeOffsetChecked(false);
        }
        break;

      case "timeOffset":
        if (checked == false) {
          setCustomTimeOffsetChecked(false);
        } else {
          setCustomTimeOffsetChecked(true);
          setCustomTimeChecked(false);
        }
        break;
      case "releaseDate":
        setCustomReleaseDateChecked(checked);
        break;
      case "rating":
        setCustomRatingChecked(checked);
        break;
      default:
        break;
    }
  };

  const savePreferences = async (postData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/SavePreferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const json = await response.json();
      if (json.status === "OK") {
        setLoading(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <TabsContent value="metadata" className="h-full focus:ring-0">
      <div className="flex h-full flex-col justify-between p-2 px-4 focus:outline-none">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center">
            <Label className="w-60">Use Custom Title</Label>
            <Checkbox
              checked={customTitleChecked}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, "title")
              }
              className="mr-10"
            />
            <Input
              disabled={!customTitleChecked}
              id="customTitle"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            ></Input>
          </div>
          <div className="flex items-center">
            <Label className="w-60">Custom Release Date</Label>
            <Checkbox
              checked={customReleaseDateChecked}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, "releaseDate")
              }
              className="mr-10"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={!customReleaseDateChecked}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !customReleaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon size={18} />
                  {customReleaseDate ? (
                    format(customReleaseDate, "yyyy-MM-dd")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  disabled={!customReleaseDateChecked}
                  mode="single"
                  selected={customReleaseDate}
                  onSelect={setCustomReleaseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center">
            <Label className="w-60">Custom Time Played</Label>
            <Checkbox
              checked={customTimeChecked}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, "time")
              }
              className="mr-10"
            />
            <Input
              disabled={!customTimeChecked}
              id="customTime"
              value={customTime}
              onChange={(e) => {
                const value = e.target.value;
                // Restrict input to only numbers and up to 2 decimal places
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setCustomTime(value);
                }
              }}
            />
          </div>
          <div className="flex items-center">
            <Label className="w-60">Custom Time Offset</Label>
            <Checkbox
              checked={customTimeOffsetChecked}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, "timeOffset")
              }
              className="mr-10"
            />
            <Input
              disabled={!customTimeOffsetChecked}
              id="customTimeOffset"
              value={customTimeOffset}
              onChange={(e) => {
                const value = e.target.value;
                if (/^-?\d*\.?\d{0,2}$/.test(value)) {
                  setCustomTimeOffset(value);
                }
              }}
            />
          </div>
          <div className="flex items-center">
            <Label className="w-60">Custom Rating</Label>
            <Checkbox
              checked={customRatingChecked}
              onCheckedChange={(checked) =>
                handleCheckboxChange(checked, "rating")
              }
              className="mr-10"
            />
            <Input
              disabled={!customRatingChecked}
              id="customRating"
              value={customRating}
              onChange={(e) => {
                const value = e.target.value;
                // Restrict input to only numbers and up to 2 decimal places
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  setCustomRating(value);
                }
              }}
            />
          </div>
        </div>
        <div className="self-end">
          <Button onClick={saveClickHandler} variant={"dialogSaveButton"}>
            Save {loading && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
