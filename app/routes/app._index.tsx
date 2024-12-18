import {type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Button,
  Link
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      shop {
        myshopifyDomain
      }
    }
  `);

  const { data } = await response.json();
  return {  myshopifyDomain: data.shop.myshopifyDomain};
};

const WIDGET_ID = process.env.SHOPIFY_FEED_WIDGET_ID || "";

export default function Index() {
  const {myshopifyDomain } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const navigate = useNavigate();
  const installUrl = `https://${myshopifyDomain}/admin/themes/current/editor?template=product&addAppBlockId=${WIDGET_ID}/feedback-widget&target=sectionGroup:header`;
  


  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h1" variant="headingMd">
                Welcome to your Shopify app
              </Text>
            </BlockStack>
            <Button url={installUrl}
            external 
            target="_blank">Add widget</Button>
          </Card>

          <Link
                            url="app/dashboard"
                            target="_blank"
                            removeUnderline
                          >
                            App Bridge
                          </Link>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

