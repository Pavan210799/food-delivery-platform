const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=75`

export const categories = [
  {
    id: 'american',
    label: 'Grill',
    image: photo('photo-1544025162-d76694265947'),
  },
  {
    id: 'indian',
    label: 'Indian',
    image: photo('photo-1585937421612-70a008356fbe'),
  },
  {
    id: 'italian',
    label: 'Italian',
    image: photo('photo-1621996346565-e3dbc646d9a9'),
  },
  {
    id: 'japanese',
    label: 'Japanese',
    image: photo('photo-1579871494447-9811cf80d66c'),
  },
  {
    id: 'mexican',
    label: 'Mexican',
    image: photo('photo-1565299585323-38d6b0865b47'),
  },
  {
    id: 'mediterranean',
    label: 'Mezze',
    image: photo('photo-1540189549336-e6e99c3679fe'),
  },
]
