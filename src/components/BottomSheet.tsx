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
                className="interactive-bottom-sheet"
                style={{
                    zIndex: 1000,
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                    borderTop: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
                    boxShadow: isDarkMode
                      ? "0px -8px 32px rgba(0, 0, 0, 0.4), 0px 0px 0px 1px rgba(255, 255, 255, 0.04)"
                      : "0px -8px 32px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(0, 0, 0, 0.04)",
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
