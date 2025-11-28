import { memo } from "react";
import { Sheet } from "react-modal-sheet";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";
import { useMediaQuery } from "../hooks/useMediaQuery";

const BottomSheet = memo(() => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const isMobile = useMediaQuery("(max-width: 768px)");

    const bgColor = isDarkMode ? "#141414" : "#ffffff";
    const borderColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

    // Snap Points (Ascending Order)
    // Index 0: 70px from bottom (Peek)
    // Index 1: 1 (100% height - Open)
    const snapPoints = [0, 50, 1];

    return (
        <Sheet
            key={isMobile ? "mobile" : "desktop"}
            isOpen={true}
            onClose={() => { }}
            snapPoints={snapPoints}
            initialSnap={1}
            disableDismiss={true}
            detent="content"
        >
            <Sheet.Container
                style={{
                    background: bgColor,
                    zIndex: 1000,
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    boxShadow: `0px -2px 10px ${borderColor}`,
                    // Full width on all devices
                }}
            >
                <Sheet.Header style={{ height: "50px" }}>
                </Sheet.Header>
                <Sheet.Content style={{ height: "100%" }}>
                    <Footer inBottomSheet={true} />
                </Sheet.Content>
            </Sheet.Container>
            {/* No backdrop shadow */}
        </Sheet>
    );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
