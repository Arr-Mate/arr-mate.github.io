import React, { useState } from "react";
import { Button, Input } from "@/components/ui";

export default function Alt1RegionSelector() {
  const [region, setRegion] = useState(null);
  const [discordWebhook, setDiscordWebhook] = useState("");

  const selectRegion = () => {
    if (!window.alt1) {
      alert("Alt1 is not detected. Please use Alt1-enabled browser.");
      return;
    }

    alt1.overLayRect(() => {
      const rect = alt1.getSelection();
      setRegion(rect);
    });
  };

  const sendToDiscord = async () => {
    if (!region || !discordWebhook) {
      alert("Region and Discord Webhook URL are required.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = region.width;
      canvas.height = region.height;

      ctx.drawImage(
        alt1.capture(region.x, region.y, region.width, region.height),
        0,
        0
      );

      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      const formData = new FormData();
      formData.append("file", blob, "region.png");

      const response = await fetch(discordWebhook, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send image to Discord.");
      }

      alert("Region sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Error sending to Discord.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Alt1 Region to Discord</h1>
      <div className="mb-4">
        <Button onClick={selectRegion}>Select Region</Button>
        {region && (
          <p className="mt-2">
            Selected Region: {region.x}, {region.y}, {region.width},{" "}
            {region.height}
          </p>
        )}
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Discord Webhook URL"
          value={discordWebhook}
          onChange={(e) => setDiscordWebhook(e.target.value)}
        />
      </div>
      <Button onClick={sendToDiscord}>Send Region to Discord</Button>
    </div>
  );
}
