export async function onRequest(context) {
  const host = context.request.headers.get("host");
  
  if (host.endsWith(".pages.dev")) {
    const redirectUrl = `https://embed.xoailac.top${new URL(context.request.url).pathname}`;
    return Response.redirect(redirectUrl, 301);
  }

  return context.next();
}