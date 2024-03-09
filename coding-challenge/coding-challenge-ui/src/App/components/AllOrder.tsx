
interface Props {
    shipmentOverdueData: any
}

const AllOrder = ({ shipmentOverdueData }: Props) => {
    const subTotal = shipmentOverdueData.map((i: any) => i.order_total).reduce((acc: any, curr: any) => +acc + +curr, 0)
    const taxTotal = shipmentOverdueData.map((i: any) => i.order_tax).reduce((acc: any, curr: any) => +acc + +curr, 0)
    const total = (taxTotal + subTotal).toLocaleString()

    const all_orders = [
        { title: 'Sub Total', context: subTotal },
        { title: 'Tax Total', context: taxTotal },
        { title: 'Total', context: total }
    ]

    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>All Order</div>
        <div> 
            {all_orders.map((i: any, index: any) => (
                <div key={index} style={{ display: 'flex', gap: '0.25rem' }}>
                <div>{i.title}:</div>
                <div style={{ fontWeight: 'bold'}}>${i.context}</div>
            </div>
            ))}
        </div>
    </div>)
}
export default AllOrder