const problems = [{
  icon: '🧭',
  title: 'Customers get lost in-store',
  body: 'Shoppers walk aisle to aisle looking for one item because there is no way to search a physical store the way you search online.'
}, {
  icon: '📋',
  title: 'Owners run stock on guesswork',
  body: 'Local supermarket owners track stock, offers and layout on paper or memory — no single view of what\'s low, what\'s selling, or where anything sits.'
}, {
  icon: '🔌',
  title: 'No affordable digital layer',
  body: 'Big chains have apps and smart shelves. Neighborhood supermarkets are left out because building software per-store is expensive.'
}];
const solutions = [{
  icon: '🏬',
  title: 'One owner dashboard',
  body: 'Manage store info, layout, products, stock, offers and orders from a single screen.'
}, {
  icon: '🗺️',
  title: 'A real map of the store',
  body: 'Every product is tied to an aisle and shelf, so "where is the shampoo" has an actual answer.'
}, {
  icon: '🔍',
  title: 'Customers search, not wander',
  body: 'Shoppers search a product and get its exact aisle and shelf in that store.'
}, {
  icon: '🏪',
  title: 'Built for many stores',
  body: 'One platform, one codebase — each store\'s data stays isolated, so this scales from one shop to a whole chain.'
}];
export default function Landing({
  onGetStarted,
  onDirectStore
}) {
  return <div className="min-h-screen bg-[var(--bg)]">
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[var(--teal)] flex items-center justify-center text-lg">🛒</div>
          <span className="font-extrabold text-[18px] text-[var(--navy-deep)]">BridgeCart</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDirectStore} className="bg-[var(--teal)] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer shadow-sm flex items-center gap-1.5">
            <span>🌐</span> 3D Store Layout
          </button>
          <button onClick={onGetStarted} className="bg-[var(--navy-deep)] text-white text-[13.5px] font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 cursor-pointer">
            Sign In
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <div className="inline-block text-[11.5px] font-bold tracking-wide text-[var(--teal-dark)] bg-[#E6F6EC] px-3.5 py-1.5 rounded-full mb-5">
          THE PROBLEM STATEMENT
        </div>
        <h1 className="text-[40px] leading-[1.15] font-extrabold text-[var(--navy-deep)] mb-5">
          Local supermarkets are offline.
          <br />
          Their customers already aren't.
        </h1>
        <p className="text-[15.5px] text-[var(--muted)] max-w-2xl mx-auto leading-relaxed mb-9">
          BridgeCart connects a neighborhood supermarket's real, physical layout to a digital dashboard the
          owner controls and a search experience the customer uses — so finding a product in-store is as easy
          as searching for it online.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={onDirectStore} className="bg-[var(--teal)] text-white text-[14.5px] font-bold px-7 py-3.5 rounded-xl hover:bg-[var(--teal-dark)] transition-colors cursor-pointer shadow-md flex items-center gap-2">
            <span>🌐</span> Explore 3D Store Layout →
          </button>
          <button onClick={onGetStarted} className="border border-[var(--navy-deep)] text-[var(--navy-deep)] bg-white text-[14.5px] font-bold px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            Get Started (Sign In)
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-wide text-center mb-7">
          Why this needs solving
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {problems.map(p => <div key={p.title} className="bg-white border border-[var(--border)] rounded-2xl p-6">
              <div className="text-[28px] mb-3">{p.icon}</div>
              <div className="font-bold text-[15px] mb-2">{p.title}</div>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed">{p.body}</div>
            </div>)}
        </div>
      </section>

      <section className="bg-white border-y border-[var(--border)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-wide text-center mb-7">
            What BridgeCart does about it
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {solutions.map(s => <div key={s.title} className="flex gap-4 border border-[var(--border)] rounded-2xl p-5">
                <div className="text-[26px] shrink-0">{s.icon}</div>
                <div>
                  <div className="font-bold text-[14.5px] mb-1">{s.title}</div>
                  <div className="text-[13px] text-[var(--muted)] leading-relaxed">{s.body}</div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-wide text-center mb-8">
          How it actually works
        </h2>
        <div className="flex items-start justify-between gap-4">
          {[{
          step: '1',
          label: 'Owner sets up their store',
          body: 'Store info, then rack layout — rows and shelves, sized to the real store.'
        }, {
          step: '2',
          label: 'Owner adds products',
          body: 'Manually or by uploading an Excel sheet — each product placed on a shelf.'
        }, {
          step: '3',
          label: 'Layout goes live',
          body: 'The dashboard shows stock, orders and offers, all tied to real shelf locations.'
        }, {
          step: '4',
          label: 'Customer searches & finds',
          body: 'A shopper searches a product and is told exactly which aisle and shelf.'
        }].map((s, i, arr) => <div key={s.step} className="flex-1 flex items-start">
              <div className="text-center flex-1">
                <div className="w-9 h-9 rounded-full bg-[var(--navy-deep)] text-white font-bold text-[13px] flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <div className="font-bold text-[13.5px] mb-1.5">{s.label}</div>
                <div className="text-[12px] text-[var(--muted)] leading-relaxed px-1">{s.body}</div>
              </div>
              {i < arr.length - 1 && <div className="h-[1px] bg-[var(--border)] w-8 mt-4 shrink-0" />}
            </div>)}
        </div>
      </section>

      <section className="text-center pb-20 px-6">
        <button onClick={onGetStarted} className="bg-[var(--navy-deep)] text-white text-[14.5px] font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity">
          Sign in to BridgeCart
        </button>
      </section>
    </div>;
}
