import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { tokens } from "@/src/theme/tokens";

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor={tokens.colors.tabBarBackground}
      blurEffect="systemChromeMaterial"
      disableTransparentOnScrollEdge
      iconColor={{
        default: tokens.colors.tabIconDefault,
        selected: tokens.colors.tabIconSelected
      }}
      labelStyle={{
        default: {
          color: tokens.colors.tabIconDefault,
          ...tokens.typography.caption
        },
        selected: {
          color: tokens.colors.tabIconSelected,
          ...tokens.typography.caption
        }
      }}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Icon
          sf={{ default: "message", selected: "message.fill" }}
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="chat-bubble-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="chat-bubble" />
          }}
        />
        <NativeTabs.Trigger.Label>Messaggi</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="person-outline" />,
            selected: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="person" />
          }}
        />
        <NativeTabs.Trigger.Label>Profilo</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="placeholder">
        <NativeTabs.Trigger.Icon
          sf={{ default: "ellipsis.circle", selected: "ellipsis.circle.fill" }}
          src={{
            default: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="more-horiz" />,
            selected: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="more" />
          }}
        />
        <NativeTabs.Trigger.Label>Da Implementare</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
