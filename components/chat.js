
export default function Chat({user}) {

    return (  
            <div id="chat" className={`flex justify-center m-3 pr-28 py-7 rounded-md ${user.user === "me" ? "bg-gray-700" : "bg-gray-600"} `}>
                <div className="w-4/5 text-gray-100 text-sm" style={{whiteSpace: 'pre-wrap'}}>
                   {user.message}  
                </div>
            </div>   
    )
}