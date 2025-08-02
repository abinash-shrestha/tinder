## Logical DB Query Compound Indexes

    - Create Model for Connection Request
        - Identity of sender and receiver (fromUserId and toUserId)
        - request status of connection [enum]
    - API
        - Status of Request : interested, ignored
        - request/send/:status(interested or ignored)/:toUserId
        - validation
            - for :status
            - for repeated duplicate connection and dual connection request
            - for checking id of user in DB
            - for connection request from user to user itself (Schema level validation)
