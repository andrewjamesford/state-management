import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/zustand/')({
  component: RouteComponent,
})

function RouteComponent() {
  const auctions = [
    {
      id: 1,
      title: 'Vintage Clock',
      price: 49.99,
      dateCloses: '2023-12-01',
      image: '',
    },
    {
      id: 2,
      title: 'Rare Book',
      price: 129.0,
      dateCloses: '2023-11-15',
      image: '',
    },
    {
      id: 3,
      title: 'Painting',
      price: 300.0,
      dateCloses: '2023-10-31',
      image: '',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <Link
          to={'/tsquery/' + auction.id}
          key={auction.id}
          className="border border-gray-300 p-4"
        >
          <img
            src={auction.image || 'https://via.placeholder.com/150'}
            alt={auction.title}
          />
          <h2>{auction.title}</h2>
          <p>Price: ${auction.price}</p>
          <p>Closes: {auction.dateCloses}</p>
        </Link>
      ))}
    </div>
  )
}
