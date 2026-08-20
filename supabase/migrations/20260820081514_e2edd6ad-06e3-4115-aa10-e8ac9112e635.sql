REVOKE EXECUTE ON FUNCTION public.assign_receipt_number(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_receipt_number(uuid) TO service_role;