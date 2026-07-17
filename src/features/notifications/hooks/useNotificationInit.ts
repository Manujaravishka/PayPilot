import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useNotificationStore } from "../store/notificationStore";
import { notificationService } from "../services/notificationService";

export function useNotificationInit(userId: string | undefined) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!userId || Platform.OS === "web") return;

    notificationService.requestPermissions().then((granted) => {
      if (granted) {
        notificationService.getExpoPushToken().then((token) => {
          if (token) {
            notificationService.saveFcmToken(userId, token);
          }
        });
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        if (data?.type) {
          addNotification(
            data.type as any,
            notification.request.content.title || "",
            notification.request.content.body || "",
            data,
          );
        }
      },
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.type) {
          addNotification(
            data.type as any,
            response.notification.request.content.title || "",
            response.notification.request.content.body || "",
            data,
          );
        }
        if (data?.screen) {
          router.push(data.screen);
        }
      },
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [userId]);
}
