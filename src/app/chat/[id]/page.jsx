
const Chat = () => {
    const router = useRouter();
    const { roomId } = router.query;
  
    return <div>Chat Room: {roomId}</div>;
}

export default Chat