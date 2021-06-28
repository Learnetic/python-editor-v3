/**
 * (c) 2021, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { useState } from "react";
import { IconButton } from "@chakra-ui/button";
import { RiSettings2Line } from "react-icons/ri";
import { SettingsDialog } from "./SettingsDialog";

const SettingsButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton
        aria-label="Settings"
        size="lg"
        variant="sidebar"
        icon={<RiSettings2Line />}
        isRound
        colorScheme="gray"
        onClick={() => setOpen(true)}
      />
      <SettingsDialog isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default SettingsButton;
