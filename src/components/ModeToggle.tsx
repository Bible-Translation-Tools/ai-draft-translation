import React from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material";

interface ModeToggleProps {
    isBatchMode: boolean;
    onChange: (isBatch: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ isBatchMode, onChange }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <ToggleButtonGroup
                exclusive
                value={isBatchMode ? "batch" : "single"}
                onChange={(_event, value) => {
                    if (value !== null) onChange(value === "batch");
                }}
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    "& .MuiToggleButtonGroup-grouped": {
                        border: "1px solid #e0e0e0",
                        borderLeft: "none",
                        '&:first-of-type': {
                            borderLeft: "1px solid #e0e0e0",
                        },
                    },
                    "& .MuiToggleButton-root": {
                        textTransform: "none",
                        padding: "6px 14px",
                        fontSize: "0.875rem",
                        color: "#333",
                        backgroundColor: "#fff",
                        "&.Mui-selected": {
                            backgroundColor: "#0F2F4C",
                            color: "#fff",
                        },
                        '&:first-of-type': {
                            borderTopLeftRadius: "8px",
                            borderBottomLeftRadius: "8px",
                        },
                        '&:last-of-type': {
                            borderTopRightRadius: "8px",
                            borderBottomRightRadius: "8px",
                        },
                    },
                }}
            >
                <ToggleButton value="batch">
                    <Typography variant="body1">Document</Typography>
                </ToggleButton>
                <ToggleButton value="single">
                    <Typography variant="body1">Text</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default ModeToggle;


