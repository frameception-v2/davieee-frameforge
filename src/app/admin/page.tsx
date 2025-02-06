"use client";

import { useState, useCallback } from "react";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { Input } from "~/components/ui/input";
import type { FrameNotificationDetails } from "@farcaster/frame-sdk";
import { NOTIFICATION_MESSAGES } from "~/lib/constants";

export default function AdminDashboard() {
  const [sendNotificationResult, setSendNotificationResult] = useState("");
  const [fid, setFid] = useState("");
  const [notificationToken, setNotificationToken] = useState("");
  const [notificationUrl, setNotificationUrl] = useState("");

  const sendNotification = useCallback(async () => {
    setSendNotificationResult("");

    if (!fid || !notificationToken || !notificationUrl) {
      setSendNotificationResult("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: Number(fid),
          notificationDetails: {
            token: notificationToken,
            url: notificationUrl
          }
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSendNotificationResult(NOTIFICATION_MESSAGES.success);
      } else {
        setSendNotificationResult(data.error || "Error sending notification");
      }
    } catch (error) {
      setSendNotificationResult("Connection error - please try again");
    }
  }, [fid, notificationToken, notificationUrl]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl">FrameForge Admin</h1>
      <div className="flex flex-1 flex-col gap-4">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-xl mb-4">Frame Deployment Notifications</h2>
          
          <div className="mb-4 space-y-3">
            <div className="space-y-2">
              <Label>Recipient FID</Label>
              <Input
                type="number"
                value={fid}
                onChange={(e) => setFid(e.target.value)}
                placeholder="Enter user FID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notification Token</Label>
              <Input
                value={notificationToken}
                onChange={(e) => setNotificationToken(e.target.value)}
                placeholder="Enter notification token"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Frame URL</Label>
              <Input
                value={notificationUrl}
                onChange={(e) => setNotificationUrl(e.target.value)}
                placeholder="Enter frame URL"
              />
            </div>

            <PurpleButton 
              onClick={sendNotification}
              disabled={!fid || !notificationToken || !notificationUrl}
            >
              Send Deployment Notification
            </PurpleButton>
          </div>

          {sendNotificationResult && (
            <div className={`p-3 rounded-md text-sm ${
              sendNotificationResult.includes("success") 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {sendNotificationResult}
            </div>
          )}
        </div>

        <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 p-4">
          <h3 className="text-lg mb-2">Activity Monitor</h3>
          <p className="text-sm text-neutral-500">
            Deployment analytics coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
