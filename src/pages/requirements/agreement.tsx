import * as React from "react";

import Dialog from "@mui/material/Dialog";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type UserAgreementProps = {
  open: boolean;
  handleClose: (agree: boolean) => void;
};

export default function UserAgreementPage({
  open,
  handleClose,
}: UserAgreementProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog fullScreen open={open} onClose={() => handleClose(false)}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="English" {...a11yProps(0)} />
            <Tab label="Tagalog" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Stack direction="column" spacing={2}>
            <Typography component="div" variant="h5" paddingBottom={2}>
              BIR RR6-Manila Self-Service Kiosk User Agreement
            </Typography>
            <Typography component="p" variant="body1">
              {
                "    The Bureau of Internal Revenue (BIR) - RR6 Manila hereby lays out the following terms, conditions, and rules for the access and use of the BIR Self-Kiosk located at the proposed RR6 One-Stop Taxpayer Lounge:"
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "1. The BIR Self-Kiosk is intended for BIR-registered taxpayers use only. It is not intended for use of persons and/or corporations located in or residents of countries outside the Philippines with no business transactions with the BIR."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "2. By accepting these terms of use, either by clicking agree or using and/or continuing to use the services, you acknowledge and represent that (a) you have read and understand these terms of use, (b) you are 18 years of age or older, and (c) you accept and agree to the terms of use without limitation or qualification."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "3. Any person who agrees into these User Agreement on behalf of another person, company or other legal entity, represents to have an authority to bind such person, company or entity. Any person who do not have such authority, or any person who do not agree to these User Agreement, must not accept these terms of use, and shall not access or use the services."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "4. To access services through the BIR Self-Kiosk, the user must input the required information as prompted by the system. The user agrees that any information provided, is true, accurate and complete. Failure to do so shall constitute a breach of these User Agreement."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "5. The BIR upholds and respects the privacy and confidentiality of all personal and taxpayer information in accordance with the Data Privacy Act of 2012. The BIR Privacy Notice is available at www.bir.gov.ph."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "6. The BIR reserves the right to add, modify or change the terms, conditions, rules, services, and features available on the BIR Self-Kiosk without prior notice."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "7. This Agreement shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any legal disputes arising from the use of the BIR Self-Kiosk shall be subject to applicable laws, rules, and regulations."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "    I have read the above terms, conditions and rules for the access and use of BIR Self-Kiosk. I also hereby acknowledge that I fully understand and agree to adhere to the terms as stated herein. Moreover, I fully understand that until I press “AGREE” at the bottom of this Agreement, I cannot use and access the BIR Self-Kiosk. Finally, I understand that additional terms, conditions, rules, services, and features may be added by BIR from time to time and it becomes part of this Agreement, and that should I violate any of the terms, conditions and rules herein set forth, I may be criminally, civilly and administratively liable pursuant to existing laws, rules and regulations, aside from the automatic cancellation of my access to the system."
              }
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ pt: 3 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleClose(true)}
              >
                Agree
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleClose(false)}
              >
                Disagree
              </Button>
            </Stack>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Stack direction="column" spacing={2}>
            <Typography component="div" variant="h5" paddingBottom={2}>
              Kasunduan sa Paggamit ng BIR RR6-Manila Self-Service Kiosk
            </Typography>
            <Typography component="p" variant="body1">
              {
                "    Ang Bureau of Internal Revenue (BIR) - RR6 Manila ay naglalatag ng mga sumusunod na termino, kundisyon, at patakaran para sa pag-access at paggamit ng BIR Self-Kiosk na matatagpuan sa panukalang RR6 One-Stop Taxpayer Lounge:"
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "1. Ang BIR Self-Kiosk ay nakalaan lamang para sa mga rehistradong BIR taxpayers. Hindi ito para sa paggamit ng mga indibidwal at/o korporasyon na naninirahan o matatagpuan sa labas ng Pilipinas na walang kaukulang transaksyon sa BIR."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                '2. Sa pagtanggap ng mga kondisyong ito, alinman sa pamamagitan ng pag-click sa "AGREE" o patuloy na paggamit ng mga serbisyo, kinikilala at kinakatawan mo na (a) nabasa at nauunawaan mo ang mga termino ng paggamit na ito, (b) ikaw ay 18 taong gulang o mas matanda, at (c) tinatanggap at sinasang-ayunan mo ang mga termino ng walang limitasyon o kondisyon.'
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "3. Ang sinumang tumatanggap ng kasunduang ito sa ngalan ng ibang tao, kumpanya, o legal na entidad ay kumakatawan na may awtoridad siya upang ipag-ugnay ang nasabing tao, kumpanya o entidad sa kasunduang ito. Ang sinumang walang ganoong awtoridad, o hindi sumasang-ayon sa kasunduang ito, ay hindi dapat tumanggap sa mga termino at hindi dapat gumamit ng serbisyo."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "4. Upang magamit ang mga serbisyo ng BIR Self-Kiosk, kailangang ilagay ng gumagamit ang lahat ng hinihinging impormasyon ayon sa prompt ng sistema. Tinatanggap ng gumagamit na ang anumang impormasyong ibinigay ay totoo, tama, at kumpleto. Ang kabiguang gawin ito ay ituturing na paglabag sa kasunduang ito."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "5. Iginagalang at pinangangalagaan ng BIR ang privacy at pagiging kumpidensyal ng lahat ng personal at impormasyon ng mga taxpayer alinsunod sa Data Privacy Act of 2012. Ang Privacy Notice ng BIR ay matatagpuan sa www.bir.gov.ph."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "6. Nananatiling karapatan ng BIR na magdagdag, magbago, o mag-amyenda ng mga termino, kundisyon, patakaran, serbisyo, at tampok ng BIR Self-Kiosk nang walang abiso."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                "7. Ang kasunduang ito ay napapailalim at ipatutupad alinsunod sa mga batas ng Republika ng Pilipinas. Anumang legal na isyu kaugnay ng paggamit ng BIR Self-Kiosk ay sasailalim sa naaangkop na batas, patakaran, at regulasyon."
              }
            </Typography>
            <Typography component="p" variant="body1">
              {
                '    Nabasa ko at naunawaan ang mga nabanggit na termino, kundisyon at patakaran para sa pag-access at paggamit ng BIR Self-Kiosk. Ako rin ay kusang loob na sumasang-ayon at nangangakong susunod sa mga ito. Nauunawaan ko rin na hanggang hindi ko pinipindot ang "AGREE" sa ibaba ng kasunduang ito, ay hindi ako maaaring gumamit ng BIR Self-Kiosk. Nauunawaan ko rin na maaaring magdagdag ang BIR ng karagdagang termino, kundisyon, patakaran, serbisyo, at tampok anumang oras at ito ay magiging bahagi ng kasunduang ito. Sakaling ako ay lumabag sa alinman sa mga nasasaad dito, ako ay maaaring managot sa ilalim ng umiiral na mga batas – kriminal, sibil, o administratibo – at maaaring agad na kanselahin ang aking access sa sistema.'
              }
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ pt: 3 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleClose(true)}
              >
                Agree
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleClose(false)}
              >
                Disagree
              </Button>
            </Stack>
          </Stack>
        </CustomTabPanel>
      </Box>
    </Dialog>
  );
}
