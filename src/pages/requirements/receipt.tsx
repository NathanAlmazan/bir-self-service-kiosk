import { useTheme } from "@mui/material/styles";

import { Document, Page, View, Text, Font, Image } from "@react-pdf/renderer";

export default function KioskReceipt() {
  const theme = useTheme();

  return (
    <Document>
      <Page
        size={[226.77, 500]}
        style={{ paddingTop: 10, paddingRight: 10, paddingLeft: 10 }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 3,
          }}
        >
          <Image
            src="/logo/bir-logo-full.png"
            style={{ width: 180, height: 30 }}
          />
        </View>
        <View style={{ textAlign: "center" }}>
          <Text
            style={{
              paddingBottom: 10,
              fontFamily: "Open Sans",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            {"SELF-SERVICE KIOSK"}
          </Text>
        </View>
        <View style={{ paddingTop: 5, textAlign: "left" }}>
          <Text style={{ fontFamily: "Open Sans", fontSize: 9 }}>
            {"YOUR TRANSACTION NUMBER:"}
          </Text>
        </View>
        <View style={{ paddingBottom: 5, textAlign: "center" }}>
          <Text
            style={{
              fontFamily: "Open Sans",
              fontWeight: "bold",
              fontSize: 28,
            }}
          >
            A-0005
          </Text>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Open Sans",
                fontWeight: "bold",
                fontSize: 10,
              }}
            >
              {"STATUS : "}
            </Text>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontSize: 10,
                color: theme.palette.success.main,
              }}
            >
              {"COMPLETE REQUIREMENTS"}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingTop: 3,
            paddingBottom: 3,
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontWeight: "bold",
                fontSize: 9,
              }}
            >
              {"RDO : "}
            </Text>
            <Text style={{ fontFamily: "Open Sans", fontSize: 9 }}>
              {"029"}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontWeight: "bold",
                fontSize: 9,
              }}
            >
              {"SERVICE TYPE : "}
            </Text>
            <Text
              style={{ fontFamily: "Open Sans", fontSize: 9, width: "100%" }}
            >
              {"[REGISTRATION] TIN APPLICATION"}
            </Text>
          </View>
        </View>
        <View style={{ paddingTop: 5, paddingBottom: 5 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontWeight: "bold",
                fontSize: 9,
              }}
            >
              {"DATE : "}
            </Text>
            <Text style={{ fontFamily: "Open Sans", fontSize: 9 }}>
              {"July 16, 2025"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontWeight: "bold",
                fontSize: 9,
              }}
            >
              {"TIME : "}
            </Text>
            <Text style={{ fontFamily: "Open Sans", fontSize: 9 }}>
              {"08:10 AM"}
            </Text>
          </View>
        </View>
        <View style={{ paddingBottom: 5, textAlign: "center" }}>
          <Text style={{ fontFamily: "Open Sans", fontSize: 8 }}>
            {
              "PLEASE PROCEED TO THE RDO'S CONCERNED SECTION, WHICH WILL PROCESS THE SERVICE IMMEDIATELY."
            }
          </Text>
        </View>
        <View style={{ paddingBottom: 5, textAlign: "center" }}>
          <Text
            style={{
              fontFamily: "Open Sans",
              fontSize: 6,
              fontStyle: "italic",
            }}
          >
            {
              "For assistance, approach the Public Assistance Compliance Desk (PACD)"
            }
          </Text>
        </View>
        <View style={{ paddingBottom: 10, textAlign: "center" }}>
          <Text
            style={{
              color: theme.palette.primary.main,
              fontFamily: "Open Sans",
              fontSize: 8,
              fontStyle: "italic",
            }}
          >
            {'"Streamlining Tax Services with Comfort and Care"'}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "/fonts/open-sans/static/OpenSans-Regular.ttf",
      fontWeight: "normal",
    },
    { src: "/fonts/open-sans/static/OpenSans-Bold.ttf", fontWeight: "bold" },
    {
      src: "/fonts/open-sans/static/OpenSans-Italic.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
  ],
});
