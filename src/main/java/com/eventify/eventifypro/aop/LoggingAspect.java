package com.eventify.eventifypro.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    // Service paketindeki tüm metotların çalışma süresini yakalar
    @Around("execution(* com.eventify.eventifypro.service.impl..*(..))")
    public Object measureMethodExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        // Metodun kendisini çalıştır
        Object result = joinPoint.proceed();

        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;

        log.info("⏱️ [AOP Performance Log] Method: {} executed in {} ms",
                joinPoint.getSignature().toShortString(), executionTime);

        return result;
    }
}