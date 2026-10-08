export type Destination ={
    id: number;
    name: string;
    location: string;
    category: string;
    image: string;
    description: string;
};

export const destinations: Destination[] =[
    {
        id: 1,
        name: "Sigiriya",
        location: "Central Province, Sri Lanka",
        category: "Heritage",
        image:"https://share.google/gfuxCRvMj22iOz5gX",
        description: "An ancient rock fortress rising from the green heart of Sri Lanka,"
    },
    {
        id: 2,
        name: "Yala National Park",
        location:"Southern Province,Sri Lanka",
        category: "Wildlife",
        image: "https://cdn.getyourguide.com/image/format=auto%2Cfit=contain%2Cgravity=auto%2Cquality=60%2Cwidth=1440%2Cheight=650%2Cdpr=2/tour_img/96591ec77008733632f2a4f50c0f4fbc14289cd26b9b49c9d337cbd7ab3c6538.jpeg",
        description: "Yala National Park is a wildlife sanctuary in Sri Lanka, known for its diverse ecosystems and rich biodiversity. It is home to a variety of animals, including elephants, leopards, and numerous bird species."
    },
    {
        id: 3,
        name: "Mirissa",
        location:"Southern coast of Sri Lanka",
        category: "Beach",
        image: "https://cdn.getyourguide.com/image/format=auto%2Cfit=contain%2Cgravity=auto%2Cquality=60%2Cwidth=1440%2Cheight=650%2Cdpr=2/tour_img/96591ec77008733632f2a4f50c0f4fbc14289cd26b9b49c9d337cbd7ab3c6538.jpeg",
        description: "Mirissa is a small town on the southern coast of Sri Lanka, known for its beautiful beaches and vibrant nightlife. It is a popular destination for tourists seeking relaxation, water sports, and whale watching."
    }
]