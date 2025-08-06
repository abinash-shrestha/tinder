## NOTES

    - Create Model for Connection Request
        - Identity of sender and receiver (fromUserId and toUserId)
        - request status of connection [enum]
    - API
        #ConnectionRequestRouter
        ## For sending connection request
        - POST: /request/send/:status/:toUserId
        - Status of Request : interested, ignored
        - request/send/:status(interested or ignored)/:toUserId
        - validation
            - for :status
            - for repeated duplicate connection and dual connection request
            - for checking id of user in DB
            - for connection request from user to user itself (Schema level validation)
        - Indexing in DB for faster db queries

        ## For reviewing connection request
        - POST: /request/review/:status/:requestId
        - Status of Request : accepted, rejected
        - request/send/:status(accepted or rejected)/:requestId
        - Validation
            - for :status
            - for requestId, to find connection request at db

        #UserRouter
        ## For viewing all pending connection request
        - GET: /user/request/received
        - used ref and populate to fetch user info from id of sender

        ## For viewing connection (which user has accepted the connection)
        - GET: /user/connections

        ## For displaying feed
        - GET /user/feed
        - validations will be user should not be shown their own profile, already connected profile, req sent/received profile, ignored profile
        - pagination filter to limit number of users sent back to feed to load using skip and limit method in mongoDB
