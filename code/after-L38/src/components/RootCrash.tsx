// The last safety net, around the whole app. If the header or the router itself crashes, nothing
// else is left to show a message, so this one needs no router: a plain page and a plain reload.
export function RootCrash() {
  return (
    <section className="status-page" role="alert">
      <p className="eyebrow">Oh là là</p>
      <h1 className="title">Le Bistro is having a bad moment</h1>
      <p className="status-page__text">Please reload the page. If it happens again, tell us.</p>
      <button type="button" className="btn" onClick={() => window.location.reload()}>
        Reload the page
      </button>
    </section>
  );
}
