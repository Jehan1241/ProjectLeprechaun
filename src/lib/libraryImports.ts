import { useSortContext } from "@/hooks/useSortContex";

export const importSteamLibrary = async (
  steamID: string,
  apiKey: string,
  setSteamLoading: (loading: boolean) => void,
  setIntegrationLoadCount: (fn: (prev: number) => number) => void,
  toast: any
) => {
  if (!steamID || !apiKey) {
    return;
  }

  setSteamLoading(true);
  setIntegrationLoadCount((prev: number) => prev + 1);
  try {
    toast({
      variant: "default",
      title: "Steam Integration Started!",
      description: "You can safely leave this page now.",
    });
    const response = await fetch("http://localhost:8080/SteamImport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SteamID: steamID.trim(),
        APIkey: apiKey.trim(),
      }),
    });

    if (!response.ok) {
      const errorResp = await response.json();
      const errorMessage = errorResp.error || "An unknown error occurred.";
      const errorDetails = errorResp.details || "";
      throw errorMessage + " -- " + errorDetails;
    }
    toast({
      variant: "default",
      title: "Library Integrated!",
      description: "Your Steam library has been successfully integrated.",
    });
    setSteamLoading(false);
  } catch (error) {
    setSteamLoading(false);
    console.error("Error:", error);
    toast({
      variant: "destructive",
      title: "Failed to Get Metadata!",
      description: error || "An unknown error occurred",
    });
    return;
  }
  setIntegrationLoadCount((prev: number) => prev - 1);
};

export const importPlaystationLibrary = async (
  npsso: string,
  setPsnLoading: (loading: "true" | "false" | "error") => void,
  setPsnGamesNotMatched: (games: string[]) => void,
  setIntegrationLoadCount: (fn: (prev: number) => number) => void
) => {
  if (!npsso) {
    console.error("NPSSO token is required.");
    return;
  }

  console.log("Sending PlayStation Import Req", npsso);
  setIntegrationLoadCount((prev: number) => prev + 1);
  setPsnLoading("true");

  try {
    const response = await fetch("http://localhost:8080/PlayStationImport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        npsso: npsso,
        clientID: "bg50w140115zmfq2pi0uc0wujj9pn6",
        clientSecret: "1nk95mh97tui5t1ct1q5i7sqyfmqvd",
      }),
    });

    const resp = await response.json();
    console.log("PSN Error:", resp.error);
    console.log("PSN Games Not Matched:", resp.gamesNotMatched);

    setPsnLoading(resp.error);
    if (!resp.error) {
      setPsnGamesNotMatched(resp.gamesNotMatched);
    }
  } catch (error) {
    console.error("Error:", error);
    setPsnLoading("error");
  }

  setPsnLoading("false");
  setIntegrationLoadCount((prev: number) => prev - 1);
};
