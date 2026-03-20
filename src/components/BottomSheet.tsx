import { memo } from "react";
import { Sheet } from "react-modal-sheet";
import Footer from "./Footer";
import { useMediaQuery } from "../hooks/useMediaQuery";
import "./BottomSheet.css";

import { useTheme } from "../context/ThemeContext";

const BottomSheet = memo(() => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Snap Points (Ascending Order)
    // Index 0: 70px from bottom (Peek)
    const snapPoints = [0, 38, 1];

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
                    backgroundColor: isDarkMode ? "rgba(20, 20, 20, 0.76)" : "rgba(255, 255, 255, 0.82)",
                    backdropFilter: "blur(20px) saturate(145%)",
                    WebkitBackdropFilter: "blur(20px) saturate(145%)",
                    zIndex: 1000,
                    borderTopLeftRadius: "24px",
                    borderTopRightRadius: "24px",
                    borderTop: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                    boxShadow: "0px -8px 30px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                }}
            >
                <Sheet.Header style={{ height: "38px" }}>
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
