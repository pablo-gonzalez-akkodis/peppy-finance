import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useActiveWagmi from "@symmio-client/core/lib/hooks/useActiveWagmi";
import {
  useActiveAccount,
  useAddInWhitelist,
  useIsWhiteList,
} from "@symmio-client/core/state/user/hooks";

export default function Updater() {
  const { account } = useActiveWagmi();
  const subAccount = useActiveAccount();

  const [whitelist, setWhitelist] = useState<null | boolean>(null);
  const [subWhitelist, setSubWhitelist] = useState<null | boolean>(null);

  const getWhiteList = useIsWhiteList(account);
  const getSubAccountWhitelist = useIsWhiteList(subAccount?.accountAddress);
  const addInWhitelist = useAddInWhitelist(subAccount?.accountAddress);

  useEffect(() => {
    if (account && subAccount && whitelist && subWhitelist == false) {
      addInWhitelist()
        .then((res: { successful: boolean; message: string }) => {
          // response
          // SUCCESS : {'successful'=True, message=''}
          // FAILED : {'successful'=False, message=''}
          // EXISTS : {'successful'=False, message='exists'}
          if (res.successful) {
            setSubWhitelist(true);
            toast.success("Activating succeeded");
          } else if (!res.successful && res.message === "exists") {
            setSubWhitelist(true);
          } else {
            setSubWhitelist(null);
            toast.error("Not activated");
          }
        })
        .catch((e) => {
          console.log(e);
          toast.error("Not activated");
        });
    }
  }, [addInWhitelist, subWhitelist, whitelist, account, subAccount]);

  useEffect(() => {
    if (subAccount)
      getSubAccountWhitelist()
        .then((res) => {
          setSubWhitelist(res);
        })
        .catch((e) => {
          console.log(e);
          setSubWhitelist(null);
        });
  }, [getSubAccountWhitelist, subAccount]);

  useEffect(() => {
    getWhiteList()
      .then((res) => {
        setWhitelist(res);
      })
      .catch((e) => {
        console.log(e);
        setWhitelist(null);
      });
  }, [getWhiteList]);

  return <></>;
}
