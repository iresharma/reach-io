import * as s3 from "../aws/s3.aws.server";
import * as db from "../../database/storage.database.server";

const StorageRef = (function () {
  return {
    initializeStorage: async (userAccount) => {
      try {
        const storageBucket = await s3
          .createBucket(userAccount).catch(error => {
            console.log(error);
            return null;
          })
        if (!storageBucket) return null;
      } catch (error) {
        return null;
      }
      const { user } = await db.createBucket(
        userAccount.id,
      );
      return user;
    },
    getStorageInfo: async ({ bucketId }) => {
      const bucket = await db.fetchBucket(bucketId);
      return bucket;
    },
    uploadFile: async ({ account, files }) => {
      const bucketName = `customer-${account.account_name.toLowerCase().replace('@', '-')}`;
      const promises = files.map((file) => s3.putPresignedURL(bucketName, file))
    },
  };
})();

export default StorageRef;
