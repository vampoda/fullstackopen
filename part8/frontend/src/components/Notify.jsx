const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }

  return (
    <div 
      role="alert" 
      style={{ 
        color: "red", 
        padding: "10px", 
        border: "1px solid red", 
        backgroundColor: "#f8d7da", 
        borderRadius: "5px",
        margin: "10px 0"
      }}
    >
      {errorMessage}
    </div>
  );
};

export default Notify;
